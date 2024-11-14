package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.ClientRepository;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class ClientRepositoryImpl implements ClientRepository {

  final ClientHibernateDao clientHibernateDao;

  final ServiceRatingHibernateDao serviceRatingHibernateDao;

  final BookLoanHibernateDao bookLoanHibernateDao;

  final LoanItemHibernateDao loanItemHibernateDao;

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
        .map(
            clientRecord ->
                clientHibernateDao
                    .save(clientRecord)
                    .map(ignore -> serviceRatingHibernateDao.save(clientRecord.getServiceRating()))
                    .thenReturn(client))
        .thenReturn(client);
  }

  @Override
  public Mono<Client> saveBookLoan(Client client) {
    return ClientRecord.bookLoans(client)
        .flatMap(
            clientRecord -> {
              clientRecord.setIsNew(false);
              var loanRecords = clientRecord.getBookLoans();
              var loanItemRecords =
                  loanRecords.stream()
                      .map(BookLoanRecord::getLoanDetails)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());
              return clientHibernateDao
                  .save(clientRecord)
                  .flatMapMany(ignore -> bookLoanHibernateDao.saveAll(loanRecords))
                  .collectList()
                  .flatMapMany(ignore -> loanItemHibernateDao.saveAll(loanItemRecords))
                  .collectList()
                  .thenReturn(client);
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveBookRating(Client client) {
    return ClientRecord.bookRatings(client)
        .flatMap(
            clientRecord ->
                clientHibernateDao
                    .save(clientRecord)
                    .flatMapMany(
                        ignore -> bookRatingHibernateDao.saveAll(clientRecord.getBookRatings()))
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

              return clientHibernateDao
                  .save(clientRecord)
                  .flatMapMany(ignore -> bookSaleHibernateDao.saveAll(purchaseRecords))
                  .collectList()
                  .flatMapMany(ignore -> saleItemHibernateDao.saveAll(salesItemRecords))
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

              return clientHibernateDao
                  .save(clientRecord)
                  .flatMapMany(ignore -> bookReservationHibernateDao.saveAll(reservationRecords))
                  .collectList()
                  .flatMapMany(ignore -> bookReservationItemHibernateDao.saveAll(reservationItems))
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
              return clientHibernateDao
                  .save(clientRecord)
                  .flatMapMany(ignore -> cartHibernateDao.saveAll(cartRecords))
                  .collectList()
                  .flatMapMany(ignore -> cartItemHibernateDao.saveAll(cartItemsRecords))
                  .collectList()
                  .map(ignored -> client)
                  .onErrorResume((error) -> Mono.just(client));
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> synchronize(Client client) {
    // return saveCarts(client);
    return Mono.zip(saveCarts(client), saveBookLoan(client)).thenReturn(client);
  }
}
