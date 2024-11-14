package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.ClientRepository;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.reactivestreams.Publisher;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class ClientRepositoryImpl implements ClientRepository {

  final ClientHibernateDao clientHibernateDao;

  final ServiceRatingHibernateDao serviceRatingHibernateDao;

  final BookLoanHibernateDao bookLoanHibernateDao;

  final LoanItemHibernateDao loanItemHibernateDao;

  final LoanStatusHibernateDao loanStatusHibernateDao;

  final BookRatingHibernateDao bookRatingHibernateDao;

  final BookSaleHibernateDao bookSaleHibernateDao;

  final SaleItemHibernateDao saleItemHibernateDao;

  final BookReservationHibernateDao bookReservationHibernateDao;

  final BookReservationItemHibernateDao bookReservationItemHibernateDao;

  final CartHibernateDao cartHibernateDao;

  final CartItemHibernateDao cartItemHibernateDao;

  public ClientRepositoryImpl(
      ClientHibernateDao clientHibernateDao,
      ServiceRatingHibernateDao serviceRatingHibernateDao,
      BookLoanHibernateDao bookLoanHibernateDao,
      LoanItemHibernateDao loanItemHibernateDao,
      LoanStatusHibernateDao loanStatusHibernateDao,
      BookRatingHibernateDao bookRatingHibernateDao,
      BookSaleHibernateDao bookSaleHibernateDao,
      SaleItemHibernateDao saleItemHibernateDao,
      BookReservationHibernateDao bookReservationHibernateDao,
      BookReservationItemHibernateDao bookReservationItemHibernateDao,
      CartHibernateDao cartHibernateDao,
      CartItemHibernateDao cartItemHibernateDao) {
    this.clientHibernateDao = clientHibernateDao;
    this.serviceRatingHibernateDao = serviceRatingHibernateDao;
    this.bookLoanHibernateDao = bookLoanHibernateDao;
    this.loanItemHibernateDao = loanItemHibernateDao;
    this.loanStatusHibernateDao = loanStatusHibernateDao;
    this.bookRatingHibernateDao = bookRatingHibernateDao;
    this.bookSaleHibernateDao = bookSaleHibernateDao;
    this.saleItemHibernateDao = saleItemHibernateDao;
    this.bookReservationHibernateDao = bookReservationHibernateDao;
    this.bookReservationItemHibernateDao = bookReservationItemHibernateDao;
    this.cartHibernateDao = cartHibernateDao;
    this.cartItemHibernateDao = cartItemHibernateDao;
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
  public Mono<Client> saveBookLoan(Client client) {
    return ClientRecord.bookLoans(client)
        .flatMap(
            clientRecord -> {
              var loanRecords = clientRecord.getBookLoans();

              var loanItemRecords =
                  loanRecords.stream()
                      .map(BookLoanRecord::getLoanDetails)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());

              var loanStatusRecords =
                  loanRecords.stream()
                      .map(BookLoanRecord::getLoanStatus)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());

              return saveClient(clientRecord)
                  .flatMap(
                      (ignored) -> saveMultipleRecords(loanRecords, bookLoanHibernateDao::saveAll))
                  .flatMap(
                      ignore -> saveMultipleRecords(loanItemRecords, loanItemHibernateDao::saveAll))
                  .flatMap(
                      ignored ->
                          saveMultipleRecords(loanStatusRecords, loanStatusHibernateDao::saveAll))
                  .thenReturn(client);
            })
        .defaultIfEmpty(client);
  }

  protected <E> Mono<Set<E>> saveMultipleRecords(
      Set<E> entityRecords, Function<Set<E>, Publisher<E>> publisher) {
    return Mono.just(entityRecords)
        .filter(Predicate.not(Set::isEmpty))
        .flatMapMany(publisher)
        .collectList()
        .thenReturn(entityRecords)
        .defaultIfEmpty(entityRecords);
  }

  protected Mono<ClientRecord> saveClient(ClientRecord client) {
    return Mono.just(client)
        .filter(PersistableEntity::isNew)
        .flatMap(clientHibernateDao::save)
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveBookRating(Client client) {
    return ClientRecord.bookRatings(client)
        .flatMap(
            clientRecord ->
                saveClient(clientRecord)
                    .flatMapMany(
                        ignore ->
                            saveMultipleRecords(
                                clientRecord.getBookRatings(), bookRatingHibernateDao::saveAll))
                    .collectList()
                    .thenReturn(client))
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> savePurchase(Client client) {
    return ClientRecord.bookPurchases(client)
        .flatMap(
            clientRecord -> {
              var purchaseRecords = clientRecord.getPurchases();

              var salesItemRecords =
                  purchaseRecords.stream()
                      .map(BookSaleRecord::getSaleItems)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());

              return saveClient(clientRecord)
                  .flatMapMany(
                      ignore -> saveMultipleRecords(purchaseRecords, bookSaleHibernateDao::saveAll))
                  .collectList()
                  .flatMapMany(
                      ignore ->
                          saveMultipleRecords(salesItemRecords, saleItemHibernateDao::saveAll))
                  .collectList()
                  .thenReturn(client);
            })
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
                          saveMultipleRecords(
                              reservationRecords, bookReservationHibernateDao::saveAll))
                  .collectList()
                  .flatMapMany(
                      ignore ->
                          saveMultipleRecords(
                              reservationItems, bookReservationItemHibernateDao::saveAll))
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
                  .flatMapMany(
                      ignore -> saveMultipleRecords(cartRecords, cartHibernateDao::saveAll))
                  .collectList()
                  .flatMapMany(
                      ignore ->
                          saveMultipleRecords(cartItemsRecords, cartItemHibernateDao::saveAll))
                  .collectList()
                  .map(ignored -> client)
                  .onErrorResume((error) -> Mono.just(client));
            })
        .defaultIfEmpty(client);
  }
}
