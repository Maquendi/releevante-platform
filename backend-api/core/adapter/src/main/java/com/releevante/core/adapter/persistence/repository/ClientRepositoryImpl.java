package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.CartRepository;
import com.releevante.core.domain.repository.ClientRepository;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Transactional
@Component
public class ClientRepositoryImpl implements ClientRepository {

  final ClientHibernateDao clientHibernateDao;

  final CartRepository cartRepository;

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
      CartRepository cartRepository,
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
    this.cartRepository = cartRepository;
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
    return Mono.justOrEmpty(clientHibernateDao.findById(clientId.value()))
        .map(ClientRecord::toDomain);
  }

  @Override
  public Mono<Client> saveServiceRating(Client client) {
    return ClientRecord.serviceRating(client)
        .map(
            clientRecord -> {
              clientHibernateDao.save(clientRecord);
              serviceRatingHibernateDao.save(clientRecord.getServiceRating());
              return client;
            })
        .thenReturn(client);
  }

  @Override
  public Mono<Client> saveBookLoan(Client client) {
    return ClientRecord.bookLoans(client)
        .map(
            clientRecord -> {
              clientHibernateDao.save(clientRecord);
              var loanRecords = clientRecord.getBookLoans();
              bookLoanHibernateDao.saveAll(loanRecords);
              var loanItemRecords =
                  loanRecords.stream()
                      .map(BookLoanRecord::getLoanDetails)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());
              loanItemHibernateDao.saveAll(loanItemRecords);
              return client;
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveBookRating(Client client) {
    return ClientRecord.bookRatings(client)
        .map(
            clientRecord -> {
              clientHibernateDao.save(clientRecord);
              bookRatingHibernateDao.saveAll(clientRecord.getBookRatings());
              return client;
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> savePurchase(Client client) {
    return ClientRecord.bookPurchases(client)
        .map(
            clientRecord -> {
              clientHibernateDao.save(clientRecord);
              var purchaseRecords = clientRecord.getPurchases();
              bookSaleHibernateDao.saveAll(purchaseRecords);
              var salesItemRecords =
                  purchaseRecords.stream()
                      .map(BookSaleRecord::getSaleItems)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());
              saleItemHibernateDao.saveAll(salesItemRecords);
              return client;
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveReservations(Client client) {
    return ClientRecord.bookReservations(client)
        .map(
            clientRecord -> {
              clientHibernateDao.save(clientRecord);
              var reservationRecords = clientRecord.getReservations();
              bookReservationHibernateDao.saveAll(reservationRecords);
              var reservationItems =
                  reservationRecords.stream()
                      .map(BookReservationRecord::getReservationItems)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());
              bookReservationItemHibernateDao.saveAll(reservationItems);
              return client;
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> saveCarts(Client client) {
    return ClientRecord.carts(client)
        .map(
            clientRecord -> {
              clientHibernateDao.save(clientRecord);
              var cartRecords = clientRecord.getCarts();
              cartHibernateDao.saveAll(cartRecords);
              var cartItemsRecords =
                  cartRecords.stream()
                      .map(CartRecord::getCartItems)
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());
              cartItemHibernateDao.saveAll(cartItemsRecords);
              return client;
            })
        .defaultIfEmpty(client);
  }

  @Override
  public Mono<Client> synchronize(Client client) {
    return Mono.zip(saveCarts(client), saveBookLoan(client)).thenReturn(client);
  }
}
