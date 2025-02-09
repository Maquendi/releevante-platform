package com.releevante.core.adapter.persistence.repository;

import static java.util.stream.Collectors.groupingBy;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.dao.projections.BookCopyProjection;
import com.releevante.core.adapter.persistence.dao.projections.BookProjection;
import com.releevante.core.adapter.persistence.dao.projections.PartialBookProjection;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.core.domain.repository.SettingsRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookRepositoryImpl implements BookRepository {
  final BookHibernateDao bookHibernateDao;
  final BookImageHibernateDao bookImageHibernateDao;
  final LibraryInventoryHibernateDao libraryInventoryHibernateDao;
  final BookTagHibernateDao bookTagHibernateDao;
  final TagHibernateDao tagHibernateDao;
  final SettingsRepository settingsRepository;
  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public BookRepositoryImpl(
      BookHibernateDao bookHibernateDao,
      BookImageHibernateDao bookImageHibernateDao,
      LibraryInventoryHibernateDao libraryInventoryHibernateDao,
      BookTagHibernateDao bookTagHibernateDao,
      TagHibernateDao tagHibernateDao,
      SettingsRepository settingsRepository) {
    this.bookHibernateDao = bookHibernateDao;
    this.bookImageHibernateDao = bookImageHibernateDao;
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
    this.bookTagHibernateDao = bookTagHibernateDao;
    this.tagHibernateDao = tagHibernateDao;
    this.settingsRepository = settingsRepository;
  }

  @Transactional
  @Override
  public Flux<Book> saveAll(List<Book> books) {
    return Mono.just(books.stream().map(BookRecord::fromDomain).collect(Collectors.toList()))
        .flatMapMany(bookHibernateDao::saveAll)
        .collectList()
        .flatMapMany(
            ignored -> Flux.mergeSequential(persistBookImages(books), persistBookTags(books)))
        .thenMany(Flux.fromIterable(books));
  }

  @Override
  public Flux<Book> find(Slid slid, int page, int size, boolean synced) {
    return find(
        libraryInventoryHibernateDao.findAllCopies(slid.value(), synced, page * size, size), slid);
  }

  @Override
  public Flux<Book> find(Slid slid, int page, int size) {
    return find(libraryInventoryHibernateDao.findAllCopies(slid.value(), page * size, size), slid);
  }

  @Override
  public Flux<Book> find(int page, int size) {
    return bookHibernateDao.findPaginated(page * size, size).map(BookRecord::toDomain);
  }

  @Override
  public Flux<BookImage> getImages(Isbn isbn) {
    return bookImageHibernateDao
        .findAllByIsbnIn(Set.of(isbn.value()))
        .map(BookImageRecord::toDomain);
  }

  private Flux<BookImageRecord> persistBookImages(List<Book> books) {
    return Flux.fromStream(books.stream().map(Book::images).flatMap(List::stream))
        .map(BookImageRecord::from)
        .collectList()
        .flatMapMany(bookImageHibernateDao::saveAll);
  }

  private Flux<BookTagRecord> persistBookTags(List<Book> books) {
    return Flux.fromStream(books.stream())
        .flatMap(
            book -> Flux.fromIterable(book.tags()).flatMap(this::getTagOrSave).map(toBookTag(book)))
        .collectList()
        .flatMapMany(bookTagHibernateDao::saveAll);
  }

  private Mono<TagRecord> getTagOrSave(Tag tag) {
    return tagHibernateDao
        .findFirstByValueIgnoreCase(tag.value().en())
        .switchIfEmpty(Mono.defer(() -> tagHibernateDao.save(TagRecord.from(tag))));
  }

  private Flux<Book> find(Flux<BookCopyProjection> bookPublisher, Slid slid) {
    return this.settingsRepository
        .findCurrentBy(slid)
        .switchIfEmpty(Mono.error(new RuntimeException("library settings required")))
        .flatMapMany(
            librarySetting ->
                bookPublisher
                    .groupBy(BookCopyProjection::getIsbn)
                    .flatMap(
                        flux ->
                            flux.collectList()
                                .flatMap(
                                    projections ->
                                        buildBook(
                                            projections.getFirst(), projections, librarySetting))));
  }

  private Mono<Book> buildBook(
      BookCopyProjection projection,
      List<BookCopyProjection> bookCopyProjections,
      LibrarySetting librarySetting) {

    return Mono.fromCallable(
        () -> {
          var copiesAvailable = 0;
          var copiesAvailableForSale = 0;
          List<BookCpy> copies = new ArrayList<>(bookCopyProjections.size());

          for (BookCopyProjection copy : bookCopyProjections) {
            if (BookCopyStatus.AVAILABLE.name().equals(copy.getStatus())) {
              copiesAvailable++;
            }
            if (copy.getUsageCount() >= librarySetting.bookUsageCountBeforeEnablingSale()) {
              copiesAvailableForSale++;
            }
            copies.add(
                BookCpy.builder()
                    .isbn(projection.getIsbn())
                    .createdAt(projection.getCreatedAt())
                    .updatedAt(projection.getUpdatedAt())
                    .id(copy.getCpy())
                    .isSync(copy.isSync())
                    .status(BookCopyStatus.valueOf(copy.getStatus()))
                    .usageCount(copy.getUsageCount())
                    .build());
          }

          return Book.builder()
              .isbn(Isbn.of(projection.getIsbn()))
              .correlationId(projection.getCorrelationId())
              .translationId(projection.getTranslationId())
              .language(projection.getLang())
              .qty(copiesAvailable)
              .qtyForSale(copiesAvailableForSale)
              .rating(projection.getRating())
              .votes(projection.getVotes())
              .author(projection.getAuthor())
              .description(
                  BookDescription.builder()
                      .en(projection.getDescription())
                      .fr(projection.getDescriptionFr())
                      .es(projection.getDescriptionEs())
                      .build())
              .createdAt(projection.getCreatedAt())
              .updatedAt(projection.getUpdatedAt())
              .bindingType(Optional.ofNullable(projection.getBindingType()))
              .publicIsbn(Optional.ofNullable(projection.getPublicIsbn()))
              .publisher(projection.getPublisher())
              .printLength(projection.getPrintLength())
              .dimensions(projection.getDimensions())
              .publishDate(projection.getPublishDate())
              .price(projection.getPrice())
              .title(projection.getTitle())
              .copies(copies)
              .build();
        });
  }

  private Function<TagRecord, BookTagRecord> toBookTag(Book book) {
    return tag -> BookTagRecord.from(uuidGenerator, dateTimeGenerator, book, tag);
  }

  @Transactional
  @Override
  public Flux<LibraryInventory> saveInventory(List<LibraryInventory> inventories) {
    return libraryInventoryHibernateDao
        .saveAll(
            inventories.stream()
                .map(LibraryInventoryRecord::fromDomain)
                .collect(Collectors.toList()))
        .thenMany(Flux.fromIterable(inventories));
  }

  @Override
  public Flux<PartialBook> findAllBy(String orgId) {
    return bookHibernateDao.findAllByOrgId(orgId).map(PartialBookProjection::toDomain);
  }

  @Override
  public Flux<Book> findAllBy(String isbn, String translationId) {
    return bookHibernateDao
        .findAllBy(translationId)
        .collectList()
        .flatMapMany(
            bookProjections ->
                Flux.fromStream(
                        bookProjections.stream()
                            .collect(groupingBy(BookProjection::getIsbn))
                            .values()
                            .stream())
                    .map(
                        projections -> {
                          var bookUnit = projections.get(0).toDomain();
                          var categories =
                              projections.stream()
                                  .map(
                                      item ->
                                          CategoryTag.builder()
                                              .en(item.getCategoryEn())
                                              .fr(item.getCategoryFr())
                                              .es(item.getCategorySp())
                                              .build())
                                  .toList();
                          return bookUnit.withCategories(categories);
                        }))
        .sort(
            (b1, b2) -> {
              if (b1.isbn().equals(b2.isbn())) {
                return 0;
              } else if (b1.isbn().value().equals(isbn)) {
                return -1;
              }
              return 1;
            });
  }

  @Override
  public Flux<Book> getByTagIdList(List<String> tagIdList) {
    return bookHibernateDao.getByTagIdList(tagIdList).map(BookProjection::toDomain);
  }

  @Override
  public Flux<Book> getByIsbnList(List<String> isbnList) {
    return bookHibernateDao.getByIsbnList(isbnList).map(BookProjection::toDomain);
  }

  @Override
  public Flux<Book> getByTagValues(List<String> tagValues) {
    return bookHibernateDao.getByTagValues(tagValues).map(BookProjection::toDomain);
  }

  @Override
  public Mono<Book> findByIsbn(String isbn) {
    return null;
  }

  @Override
  public Mono<Book> updateRating(Book book) {
    return bookHibernateDao
        .updateBookRatingAndVotes(book.isbn().value(), book.rating(), book.votes())
        .thenReturn(book);
  }
}
