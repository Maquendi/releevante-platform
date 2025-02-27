package com.releevante.core.application.service.impl;

import static java.util.Comparator.comparingInt;

import com.releevante.core.application.dto.books.BookRecommendationDto;
import com.releevante.core.application.dto.clients.reservations.CreateReservationDto;
import com.releevante.core.application.dto.clients.reservations.RemoveReservationItemsDto;
import com.releevante.core.application.dto.clients.reservations.ReservationDto;
import com.releevante.core.application.dto.clients.reservations.ReservationItemDto;
import com.releevante.core.application.dto.clients.reviews.BookReviewDto;
import com.releevante.core.application.dto.clients.reviews.ServiceReviewDto;
import com.releevante.core.application.dto.clients.transactions.*;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.application.service.ClientService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.core.domain.identity.repository.SmartLibraryAccessControlRepository;
import com.releevante.core.domain.repository.*;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class ClientServiceImpl implements ClientService {
  final BookService bookService;
  final ClientRepository clientRepository;
  final AuthorizationService authorizationService;
  final SettingsRepository librarySettingRepository;
  final SmartLibraryAccessControlRepository smartLibraryAccessControlRepository;
  final BookReservationRepository bookReservationRepository;
  final BookTransactionRepository bookTransactionRepository;
  final SmartLibraryInventoryRepository smartLibraryInventoryRepository;
  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public ClientServiceImpl(
      BookService bookService,
      ClientRepository clientRepository,
      AuthorizationService authorizationService,
      BookReservationRepository reservationRepository,
      SettingsRepository librarySettingRepository,
      SmartLibraryAccessControlRepository smartLibraryAccessControlRepository,
      BookTransactionRepository bookTransactionRepository,
      SmartLibraryInventoryRepository smartLibraryInventoryRepository) {
    this.bookService = bookService;
    this.clientRepository = clientRepository;
    this.authorizationService = authorizationService;
    this.librarySettingRepository = librarySettingRepository;
    this.smartLibraryAccessControlRepository = smartLibraryAccessControlRepository;
    this.bookReservationRepository = reservationRepository;
    this.bookTransactionRepository = bookTransactionRepository;
    this.smartLibraryInventoryRepository = smartLibraryInventoryRepository;
  }

  @Override
  public Flux<TransactionSyncResponse> createTransactions(List<TransactionSyncDto> transactions) {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(
            principal ->
                Flux.fromIterable(transactions)
                    .map(transaction -> transaction.toClient(principal, uuidGenerator)))
        .flatMap(clientRepository::saveBookTransactions)
        .map(TransactionSyncResponse::from)
        .flatMap(Flux::fromIterable);
  }

  @Override
  public Mono<TransactionStatusSyncResponse> createTransactionStatus(
      List<TransactionStatusSyncDto> transactionStatuses) {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(
            principal ->
                Flux.fromIterable(transactionStatuses)
                    .map(transactionStatus -> transactionStatus.toClient(principal, uuidGenerator)))
        .flatMap(clientRepository::saveBookTransactionStatus)
        .collectList()
        .map(TransactionStatusSyncResponse::from);
  }

  @Override
  public Mono<CreateTransactionResponse> createTransaction(TransactionSyncDto transaction) {
    return authorizationService
        .getAccountPrincipal()
        .map(principal -> transaction.toClient(principal, uuidGenerator))
        .flatMap(clientRepository::saveBookTransactionStatus)
        .map(CreateTransactionResponse::from);
  }

  @Override
  public Flux<TransactionDto> getClientTransactions(ClientId clientId) {
    return bookTransactionRepository.findByClientId(clientId).map(TransactionDto::from);
  }

  @Override
  public Flux<TransactionDto> getClientTransactions() {
    return bookTransactionRepository.findAll().map(TransactionDto::from);
  }

  @Override
  public Mono<String> createBookReviews(BookReviewDto reviewDto) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal ->
                clientRepository
                    .saveBookReview(reviewDto.toClient(principal, uuidGenerator, dateTimeGenerator))
                    .map(
                        client ->
                            client.bookRatings().stream()
                                .map(BookRating::id)
                                .findFirst()
                                .orElseThrow()));
  }

  @Override
  public Flux<String> createBookReviews(List<BookReviewDto> reviews) {
    return authorizationService
        .getAccountPrincipal()
        .map(
            principal ->
                reviews.stream()
                    .map(
                        reviewDto ->
                            reviewDto.toClient(principal, uuidGenerator, dateTimeGenerator))
                    .toList())
        .flatMap(
            clients ->
                clientRepository
                    .saveBookReview(clients)
                    .collectList()
                    .map(
                        c ->
                            c.stream()
                                .map(Client::bookRatings)
                                .flatMap(Collection::stream)
                                .toList())
                    .doOnNext(
                        ratings ->
                            Flux.fromIterable(ratings)
                                .map(BookRating::isbn)
                                .collect(Collectors.toSet())
                                .flatMap(
                                    smartLibraryInventoryRepository
                                        ::updateInventoryIsSyncedFalseByIsbn)))
        .flatMapMany(ratings -> Flux.fromIterable(ratings).map(BookRating::id));
  }

  @Override
  public Mono<String> createServiceReview(ServiceReviewDto review) {
    return authorizationService
        .getAccountPrincipal()
        .map(principal -> review.toClient(principal, uuidGenerator, dateTimeGenerator))
        .flatMap(clientRepository::saveServiceReview)
        .map(Client::serviceRating)
        .map(Optional::get)
        .map(ServiceRating::id);
  }

  @Override
  public Mono<String> createReservation(CreateReservationDto reservationDto) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principals -> {
              var clientId =
                  principals.isAdmin()
                      ? ClientId.of(reservationDto.clientId())
                      : ClientId.of(principals.subject());

              var clientOrg = OrgId.of(principals.orgId());

              var maxBooksPerLoanPublisher =
                  librarySettingRepository
                      .findCurrentBy(clientOrg)
                      .collectList()
                      .filter(Predicate.not(List::isEmpty))
                      .map(
                          settings ->
                              settings.stream()
                                  .max(comparingInt(LibrarySetting::maxBooksPerLoan))
                                  .orElseThrow())
                      .map(LibrarySetting::maxBooksPerLoan)
                      .switchIfEmpty(
                          Mono.error(
                              new RuntimeException(
                                  "Failed due to misconfiguration [miss library settings]")));

              var reservationItemsCount =
                  reservationDto.items().stream()
                      .filter(item -> item.transactionType() == BookTransactionType.RENT)
                      .toList()
                      .size();

              return maxBooksPerLoanPublisher.flatMap(
                  maxBooksPerLoan ->
                      bookReservationRepository
                          .getCurrentByClient(clientId.value())
                          .flatMap(
                              reservation -> {
                                var currentReservationCount =
                                    reservation.items().stream()
                                        .filter(
                                            item ->
                                                item.transactionType() == BookTransactionType.RENT)
                                        .toList()
                                        .size();
                                var totalLoanItems =
                                    currentReservationCount + reservationItemsCount;
                                if (totalLoanItems >= maxBooksPerLoan) {
                                  throw new RuntimeException("Max items exceeded");
                                }

                                // just add new items and return this existing reservation id.
                                var bookReservationItems =
                                    reservationDto.items().stream()
                                        .map(item -> item.toDomain(uuidGenerator))
                                        .toList();
                                return bookReservationRepository.addNewItems(
                                    reservation.id(), bookReservationItems);
                              })
                          .switchIfEmpty(
                              Mono.defer(
                                  () -> {
                                    if (reservationItemsCount >= maxBooksPerLoan) {
                                      throw new RuntimeException("Max items exceeded");
                                    }

                                    return getUserAccess(clientId.value())
                                        .map(
                                            access ->
                                                reservationDto.toDomain(
                                                    clientId.value(),
                                                    dateTimeGenerator.next(),
                                                    dateTimeGenerator.next().plusDays(10),
                                                    uuidGenerator,
                                                    dateTimeGenerator))
                                        .flatMap(
                                            reservation ->
                                                clientRepository
                                                    .find(clientId)
                                                    .switchIfEmpty(
                                                        Mono.fromCallable(
                                                            () ->
                                                                Client.builder()
                                                                    .id(clientId)
                                                                    .createdAt(
                                                                        dateTimeGenerator.next())
                                                                    .updatedAt(
                                                                        dateTimeGenerator.next())
                                                                    .build()))
                                                    .map(
                                                        client ->
                                                            client.withReservations(reservation))
                                                    .flatMap(clientRepository::saveReservations)
                                                    .map(ignored -> reservation.id()));
                                  })));
            });
  }

  Mono<SmartLibraryAccess> getUserAccess(String accessId) {
    return Mono.justOrEmpty(accessId)
        .flatMap(
            clientId ->
                smartLibraryAccessControlRepository
                    .findActiveByAccessId(clientId)
                    .switchIfEmpty(
                        Mono.error(
                            new RuntimeException("Client with " + clientId + " does not exist")))
                    .collectList()
                    .map(accessList -> accessList.stream().findFirst()))
        .map(Optional::get);
  }

  Mono<Boolean> validateCurrentReservations(
      AccountPrincipal principal, ClientId clientId, List<ReservationItemDto> reservationItems) {
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
                bookReservationRepository
                    .getCurrentByClient(clientId.value())
                    .map(
                        reservation -> {
                          var totalLoanItems =
                              reservation.items().stream()
                                      .filter(
                                          item ->
                                              item.transactionType() == BookTransactionType.RENT)
                                      .toList()
                                      .size()
                                  + reservationItems.stream()
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

  @Override
  public Mono<String> addReservationItems(
      String reservationId, ClientId clientId, List<ReservationItemDto> newItems) {
    return authorizationService
        .getAccountPrincipal()
        .filterWhen(principal -> validateCurrentReservations(principal, clientId, newItems))
        .map(principal -> newItems.stream().map(item -> item.toDomain(uuidGenerator)))
        .map(Stream::toList)
        .flatMap(items -> bookReservationRepository.addNewItems(reservationId, items));
  }

  @Override
  public Mono<String> removeReservationItem(RemoveReservationItemsDto removeReservationItems) {
    return bookReservationRepository
        .removeItems(removeReservationItems.reservationId(), removeReservationItems.itemsIds())
        .thenReturn(removeReservationItems.reservationId());
  }

  @Override
  public Mono<ReservationDto> getReservation(ClientId clientId) {
    return bookReservationRepository.getCurrentByClient(clientId.value()).map(ReservationDto::from);
  }

  @Override
  public Flux<ReservationDto> getReservations(OrgId orgId) {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(
            principal -> {
              if (principal.isSuperAdmin()) {
                return bookReservationRepository.findAll(orgId).map(ReservationDto::from);
              }
              return bookReservationRepository
                  .findAll(OrgId.of(principal.orgId()))
                  .map(ReservationDto::from);
            });
  }

  @Override
  public Flux<ReservationDto> getReservations() {
    return Flux.empty();
  }

  @Override
  public Mono<BookRecommendationDto> getBookRecommendation(List<String> userPreferences) {
    return bookService.getBookRecommendation(userPreferences);
  }
}
