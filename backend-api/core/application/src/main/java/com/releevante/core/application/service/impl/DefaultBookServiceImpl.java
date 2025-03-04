package com.releevante.core.application.service.impl;

import static java.util.Comparator.comparingInt;
import static java.util.stream.Collectors.groupingBy;

import com.releevante.core.application.dto.books.BookDto;
import com.releevante.core.application.dto.books.BookRecommendationDto;
import com.releevante.core.application.dto.books.TagCreateDto;
import com.releevante.core.application.dto.clients.reservations.CreateReservationDto;
import com.releevante.core.application.dto.clients.reviews.BookReviewDto;
import com.releevante.core.application.dto.sl.LibraryInventoryDto;
import com.releevante.core.application.dto.sl.SyncStatus;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.service.BookRegistrationService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.identity.repository.SmartLibraryAccessControlRepository;
import com.releevante.core.domain.repository.*;
import com.releevante.core.domain.repository.ratings.BookRatingRepository;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.*;
import com.releevante.types.exceptions.InvalidInputException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Predicate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.annotation.Nullable;

public class DefaultBookServiceImpl implements BookService {
  private final BookRepository bookRepository;
  private final BookRegistrationService bookRegistrationService;
  private final BookTagRepository bookTagRepository;
  private final SmartLibraryRepository smartLibraryRepository;
  private final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  private final SequentialGenerator<ZonedDateTime> dateTimeGenerator =
      ZonedDateTimeGenerator.instance();
  final AuthorizationService authorizationService;
  final BookRatingRepository bookRatingRepository;
  final BookReservationRepository reservationRepository;
  final SettingsRepository librarySettingRepository;
  final SmartLibraryAccessControlRepository smartLibraryAccessControlRepository;
  private static final int BATCH_SIZE = 100;

  final ClientRepository clientRepository;

  public DefaultBookServiceImpl(
      BookRepository bookRepository,
      BookRegistrationService bookRegistrationService,
      BookTagRepository bookTagRepository,
      SmartLibraryRepository smartLibraryRepository,
      AuthorizationService authorizationService,
      BookRatingRepository bookRatingRepository,
      BookReservationRepository reservationRepository,
      SettingsRepository librarySettingRepository,
      SmartLibraryAccessControlRepository smartLibraryAccessControlRepository,
      ClientRepository clientRepository) {
    this.bookRegistrationService = bookRegistrationService;
    this.bookRepository = bookRepository;
    this.bookTagRepository = bookTagRepository;
    this.smartLibraryRepository = smartLibraryRepository;
    this.authorizationService = authorizationService;
    this.bookRatingRepository = bookRatingRepository;
    this.reservationRepository = reservationRepository;
    this.librarySettingRepository = librarySettingRepository;
    this.smartLibraryAccessControlRepository = smartLibraryAccessControlRepository;
    this.clientRepository = clientRepository;
  }

  @Override
  public Mono<Long> executeLoadBooks() {
    return bookRegistrationService
        .getBookInventory()
        .buffer(BATCH_SIZE)
        .flatMap(bookRepository::saveAll)
        .count()
        .subscribeOn(Schedulers.boundedElastic());
  }

  @Override
  public Mono<Long> executeLoadInventory(Slid slid, String source) {
    return smartLibraryRepository
        .findWithAllocations(slid)
        .doOnNext(AbstractSmartLibrary::validateIsActive)
        .flatMap(
            smartLibrary ->
                bookRegistrationService
                    .getLibraryInventory(source)
                    .collectList()
                    .flatMapMany(inventories -> buildInventory(inventories, smartLibrary))
                    .buffer(BATCH_SIZE)
                    .flatMap(bookRepository::saveInventory)
                    .count())
        .switchIfEmpty(Mono.error(new InvalidInputException("Smart library not exist")));
  }

  @Override
  public Flux<Tag> createTags(TagCreateDto dto) {
    return bookTagRepository.create(dto.toDomain(uuidGenerator, dateTimeGenerator));
  }

  @Override
  public Flux<Book> getBooks(
      Slid slid,
      int page,
      int size,
      SyncStatus status,
      boolean includeImages,
      boolean includeTags) {

    if (Objects.isNull(status)) {
      return aggregateBooks(bookRepository.find(slid, page, size), includeImages, includeTags);
    }

    return aggregateBooks(
        bookRepository.find(slid, page, size, status.toBoolean()), includeImages, includeTags);
  }

  @Override
  public Flux<Book> getBooks(int page, int size, boolean includeImages, boolean includeTags) {
    return aggregateBooks(bookRepository.find(page, size), includeImages, includeTags);
  }

  @Override
  public Flux<PartialBook> getBooks(@Nullable String orgId) {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(
            principal -> {
              if (principal.isM2M()) {
                return bookRepository.findAllBy();
              }

              if (principal.isSuperAdmin()) {
                return orgId == null ? bookRepository.findAllBy() : bookRepository.findAllBy(orgId);
              }

              return bookRepository.findAllBy(principal.orgId());
            });
  }

  @Override
  public Flux<PartialBook> getBooksByOrg() {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(principal -> bookRepository.findAllBy(principal.orgId()));
  }

  @Override
  public Flux<Tag> getTags(List<TagTypes> name) {
    return bookTagRepository.get(name);
  }

  @Override
  public Mono<Tag> getTag(TagTypes name, String value) {
    return bookTagRepository.get(name, value);
  }

  @Override
  public Mono<Book> saveBook(BookDto book) {
    return null;
  }

  @Override
  public Mono<BookCategories> getBookCategories(@Nullable String orgId) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal -> {
              if (principal.isM2M() || principal.isSuperAdmin()) {
                return bookTagRepository.getBookCategories(orgId);
              }
              return bookTagRepository.getBookCategories(principal.orgId());
            });
  }

  @Override
  public Flux<Book> getBooksBy(String isbn, String translationId) {
    return this.bookRepository.findAllBy(isbn, translationId);
  }

  @Override
  public Flux<Book> getByTagIdList(List<String> tagIdList) {
    return bookRepository.getByTagIdList(tagIdList);
  }

  @Override
  public Mono<BookRecommendationDto> getBookRecommendation(List<String> userPreferences) {

    return getByTagIdList(userPreferences)
        .collectList()
        .filter(Predicate.not(List::isEmpty))
        .flatMap(
            (res) -> {
              var booksOrdered =
                  res.stream().collect(groupingBy(Book::isbn)).entrySet().stream()
                      .sorted(comparingInt(entry -> entry.getValue().size()))
                      .map(Map.Entry::getValue)
                      .flatMap(Collection::stream)
                      .toList();

              var recommendedBook = booksOrdered.get(booksOrdered.size() - 1);
              var otherRecommendedBooks = booksOrdered.stream().map(PartialBook::from).toList();

              var bookRecommendationBuilder =
                  BookRecommendationDto.builder().others(otherRecommendedBooks);

              return this.getBooksBy(
                      recommendedBook.isbn().value(), recommendedBook.translationId())
                  .collectList()
                  .map(bookRecommendationBuilder::recommended)
                  .map(BookRecommendationDto.Builder::build);
            });
  }

  @Override
  public Flux<Book> getByIsbnList(List<String> isbnList) {
    return bookRepository.getByIsbnList(isbnList);
  }

  @Override
  public Flux<Book> getByTagValues(List<String> tagValues) {
    return bookRepository.getByTagValues(tagValues);
  }

  @Override
  public Mono<Isbn> rate(BookReviewDto ratingDto) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal ->
                bookRatingRepository.rate(
                    ratingDto.toDomain(principal, uuidGenerator, dateTimeGenerator)));
  }

  @Override
  public Mono<String> reserve(CreateReservationDto reservationDto) {
    return authorizationService
        .getAccountPrincipal()
        .filterWhen(principal -> validateCurrentReservations(principal, reservationDto))
        .flatMap(
            principal ->
                Mono.justOrEmpty(reservationDto.clientId())
                    .flatMap(
                        clientId ->
                            smartLibraryAccessControlRepository
                                .findActiveByAccessId(clientId)
                                .switchIfEmpty(
                                    Mono.error(
                                        new RuntimeException(
                                            "Client with " + clientId + " does not exist")))
                                .thenReturn(clientId))
                    .defaultIfEmpty(principal.subject())
                    .map(
                        accessId ->
                            reservationDto.toDomain(
                                accessId,
                                dateTimeGenerator.next(),
                                dateTimeGenerator.next().plusDays(10),
                                uuidGenerator,
                                dateTimeGenerator)))
        .flatMap(
            reservation ->
                clientRepository
                    .find(reservation.clientId())
                    .switchIfEmpty(
                        Mono.fromCallable(
                            () ->
                                Client.builder()
                                    .id(reservation.clientId())
                                    .reservations(List.of(reservation))
                                    .createdAt(dateTimeGenerator.next())
                                    .updatedAt(dateTimeGenerator.next())
                                    .build()))
                    .flatMap(clientRepository::saveReservations)
                    .map(client -> client.reservations().get(0).id()));
  }

  Mono<Boolean> validateCurrentReservations(
      AccountPrincipal principal, CreateReservationDto reservationDto) {

    var maxBooksPerLoanPublisher =
        librarySettingRepository
            .findCurrentBy(OrgId.of(principal.orgId()))
            .collectList()
            .map(
                settings ->
                    settings.stream()
                        .max(comparingInt(LibrarySetting::maxBooksPerLoan))
                        .orElseThrow())
            .map(LibrarySetting::maxBooksPerLoan)
            .switchIfEmpty(
                Mono.defer(
                    () -> Mono.error(new RuntimeException("Failed due to misconfiguration"))));

    return maxBooksPerLoanPublisher
        .flatMap(
            maxBooksPerLoan ->
                reservationRepository
                    .getCurrentByClient(principal.subject())
                    .map(
                        reservation -> {
                          var totalLoanItems =
                              reservation.items().stream()
                                      .filter(
                                          item ->
                                              item.transactionType() == BookTransactionType.RENT)
                                      .toList()
                                      .size()
                                  + reservationDto.items().stream()
                                      .filter(
                                          item ->
                                              item.transactionType() == BookTransactionType.RENT)
                                      .toList()
                                      .size();

                          if (totalLoanItems >= maxBooksPerLoan) {
                            throw new RuntimeException("Max items exceeded");
                          }

                          return true;
                        }))
        .defaultIfEmpty(true);
  }

  Flux<LibraryInventory> buildInventory(
      List<LibraryInventoryDto> inventories, SmartLibrary library) {
    return Mono.fromCallable(
            () -> {
              var availablePositions = library.availablePositions();
              var copyCount = inventories.stream().mapToInt(LibraryInventoryDto::qty).sum();
              if (availablePositions.size() < copyCount) {
                throw new RuntimeException("Insufficient positions available for allocations");
              }
              return availablePositions;
            })
        .flatMapMany(
            availablePositions -> {
              var index = new AtomicInteger(0);
              return Flux.fromStream(inventories.stream())
                  .flatMap(
                      inventory -> {
                        var createdAt = ZonedDateTimeGenerator.instance().next();
                        return mapToInventory(
                            inventory, library, createdAt, availablePositions, index);
                      });
            });
  }

  Flux<LibraryInventory> mapToInventory(
      LibraryInventoryDto inventory,
      SmartLibrary library,
      ZonedDateTime createdAt,
      List<String> availablePositions,
      AtomicInteger startIndex) {
    return Flux.range(0, inventory.qty())
        .map(
            index ->
                LibraryInventory.builder()
                    .isSync(false)
                    .id(uuidGenerator.next())
                    .isbn(inventory.bookId())
                    .status(BookCopyStatus.AVAILABLE)
                    .slid(library.id().value())
                    .updatedAt(createdAt)
                    .usageCount(0)
                    .allocation(availablePositions.get(startIndex.getAndIncrement()))
                    .createdAt(createdAt)
                    .build());
  }

  String allocateInventoryPosition(List<String> availablePositions) {
    return availablePositions.remove(0);
  }

  private Flux<Book> aggregateBooks(
      Flux<Book> bookFlux, boolean includeImages, boolean includeTags) {
    return bookFlux.flatMap(
        book -> {
          var bookImagePublisher =
              Mono.just(includeImages)
                  .filter(Boolean::booleanValue)
                  .flatMap(ignored -> bookRepository.getImages(book.isbn()).collectList())
                  .defaultIfEmpty(Collections.emptyList());

          var bookTagPublisher =
              Mono.just(includeTags)
                  .filter(Boolean::booleanValue)
                  .flatMap(ignored -> bookTagRepository.getTags(book.isbn()).collectList())
                  .defaultIfEmpty(Collections.emptyList());

          return Mono.zip(bookImagePublisher, bookTagPublisher)
              .map(
                  data -> {
                    var images = data.getT1();
                    var tags = data.getT2();
                    return book.withTags(tags).withImages(images);
                  });
        });
  }
}
