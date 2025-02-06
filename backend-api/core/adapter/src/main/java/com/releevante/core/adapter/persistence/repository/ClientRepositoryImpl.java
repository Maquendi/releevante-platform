package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.ClientRepository;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.reactivestreams.Publisher;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class ClientRepositoryImpl implements ClientRepository {

  final ClientHibernateDao clientHibernateDao;

  final ServiceRatingHibernateDao serviceRatingHibernateDao;

  final BookTransactionHibernateDao bookTransactionHibernateDao;

  final TransactionItemHibernateDao transactionItemHibernateDao;

  final TransactionStatusHibernateDao transactionStatusHibernateDao;

  final BookRatingHibernateDao bookRatingHibernateDao;

  final BookReservationHibernateDao bookReservationHibernateDao;

  final BookReservationItemHibernateDao bookReservationItemHibernateDao;

  final CartHibernateDao cartHibernateDao;

  final CartItemHibernateDao cartItemHibernateDao;

  final TransactionItemStatusRecordHibernateDao transactionItemStatusRecordHibernateDao;

  public ClientRepositoryImpl(
      ClientHibernateDao clientHibernateDao,
      ServiceRatingHibernateDao serviceRatingHibernateDao,
      BookTransactionHibernateDao bookTransactionHibernateDao,
      TransactionItemHibernateDao transactionItemHibernateDao,
      TransactionStatusHibernateDao transactionStatusHibernateDao,
      BookRatingHibernateDao bookRatingHibernateDao,
      BookReservationHibernateDao bookReservationHibernateDao,
      BookReservationItemHibernateDao bookReservationItemHibernateDao,
      CartHibernateDao cartHibernateDao,
      CartItemHibernateDao cartItemHibernateDao,
      TransactionItemStatusRecordHibernateDao transactionItemStatusRecordHibernateDao) {
    this.clientHibernateDao = clientHibernateDao;
    this.serviceRatingHibernateDao = serviceRatingHibernateDao;
    this.bookTransactionHibernateDao = bookTransactionHibernateDao;
    this.transactionItemHibernateDao = transactionItemHibernateDao;
    this.transactionStatusHibernateDao = transactionStatusHibernateDao;
    this.bookRatingHibernateDao = bookRatingHibernateDao;
    this.bookReservationHibernateDao = bookReservationHibernateDao;
    this.bookReservationItemHibernateDao = bookReservationItemHibernateDao;
    this.cartHibernateDao = cartHibernateDao;
    this.cartItemHibernateDao = cartItemHibernateDao;
    this.transactionItemStatusRecordHibernateDao = transactionItemStatusRecordHibernateDao;
  }

  @Override
  public Mono<Client> find(ClientId clientId) {
    return Mono.from(clientHibernateDao.findById(clientId.value())).map(ClientRecord::toDomain);
  }

  @Override
  public Mono<Client> saveServiceRating(Client client) {
    return ClientRecord.serviceRating(client)
        .flatMap(
            clientRecord ->
                clientHibernateDao
                    .save(clientRecord)
                    .flatMap(
                        ignore -> serviceRatingHibernateDao.save(clientRecord.getServiceRating()))
                    .thenReturn(client))
        .thenReturn(client);
  }

  @Override
  public Mono<Client> saveBookTransactions(Client client) {
    return ClientRecord.createTransactions(client)
        .flatMap(
            clientRecord -> {
              var transactionRecords = clientRecord.getTransactions();

              var transactionItemRecords =
                  transactionRecords.stream()
                      .map(BookTransactionRecord::getLoanItems)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());

              var transactionStatusRecords =
                  transactionRecords.stream()
                      .map(BookTransactionRecord::getTransactionStatus)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());

              var transactionItemStatusRecords =
                  transactionItemRecords.stream()
                      .map(TransactionItemRecord::getTransactionItemStatuses)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());

              var transactions =
                  transactionRecords.stream()
                      .filter(AuditableEntity::isNew)
                      .collect(Collectors.toSet());

              return saveClient(clientRecord)
                  .flatMap(
                      (ignored) -> saveRecords(transactions, bookTransactionHibernateDao::saveAll))
                  .flatMap(
                      ignore ->
                          saveRecords(transactionItemRecords, transactionItemHibernateDao::saveAll))
                  .flatMap(
                      ignored ->
                          saveRecords(
                              transactionStatusRecords, transactionStatusHibernateDao::saveAll))
                  .flatMap(
                      ignored ->
                          saveRecords(
                              transactionItemStatusRecords,
                              transactionItemStatusRecordHibernateDao::saveAll))
                  .thenReturn(client);
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveBookTransactionStatus(Client client) {

    var transactionStatusCreate =
        Flux.fromIterable(client.transactionStatus())
            .map(TransactionStatusRecord::fromDomain)
            .collectList()
            .flatMap(
                transactionStatusRecords ->
                    saveRecords(transactionStatusRecords, transactionStatusHibernateDao::saveAll));

    var transactionItemStatusCreate =
        Flux.fromIterable(client.transactionItemStatus())
            .map(TransactionItemStatusRecord::fromDomain)
            .collectList()
            .flatMap(
                transactionStatusRecords ->
                    saveRecords(
                        transactionStatusRecords,
                        transactionItemStatusRecordHibernateDao::saveAll));

    return Mono.zip(transactionStatusCreate, transactionItemStatusCreate).thenReturn(client);
  }

  protected <E> Mono<Collection<E>> saveRecords(
      Collection<E> entityRecords, Function<Collection<E>, Publisher<E>> publisher) {
    return Mono.just(entityRecords)
        .filter(Predicate.not(Collection::isEmpty))
        .flatMapMany(publisher)
        .collectList()
        .thenReturn(entityRecords)
        .defaultIfEmpty(entityRecords);
  }

  protected Mono<ClientRecord> saveClient(ClientRecord client) {
    return clientHibernateDao
        .existsById(Objects.requireNonNull(client.getId()))
        .flatMap(
            clientExists -> {
              if (clientExists) {
                client.setNew(false);
                return Mono.just(client);
              }
              client.setNew(true);
              return clientHibernateDao.save(client);
            });
  }

  @Override
  public Mono<Client> saveBookRating(Client client) {
    return ClientRecord.bookRatings(client)
        .flatMap(
            clientRecord ->
                saveClient(clientRecord)
                    .flatMapMany(
                        ignore ->
                            saveRecords(
                                clientRecord.getBookRatings(), bookRatingHibernateDao::saveAll))
                    .collectList()
                    .thenReturn(client))
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveReservations(Client client) {
    return ClientRecord.bookReservations(client)
        .flatMap(
            clientRecord -> {
              var reservationRecords = clientRecord.getReservations();
              var reservationItems =
                  reservationRecords.stream()
                      .map(BookReservationRecord::getReservationItems)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());

              return saveClient(clientRecord)
                  .flatMapMany(
                      ignore ->
                          saveRecords(reservationRecords, bookReservationHibernateDao::saveAll))
                  .collectList()
                  .flatMapMany(
                      ignore ->
                          saveRecords(reservationItems, bookReservationItemHibernateDao::saveAll))
                  .collectList()
                  .thenReturn(client);
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveCarts(Client client) {
    return ClientRecord.carts(client)
        .flatMap(
            clientRecord -> {
              var cartRecords = clientRecord.getCarts();
              var cartItemsRecords =
                  cartRecords.stream()
                      .map(CartRecord::getCartItems)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());
              return saveClient(clientRecord)
                  .flatMapMany(ignore -> saveRecords(cartRecords, cartHibernateDao::saveAll))
                  .collectList()
                  .flatMapMany(
                      ignore -> saveRecords(cartItemsRecords, cartItemHibernateDao::saveAll))
                  .collectList()
                  .map(ignored -> client)
                  .onErrorResume((error) -> Mono.just(client));
            })
        .defaultIfEmpty(client);
  }
}
