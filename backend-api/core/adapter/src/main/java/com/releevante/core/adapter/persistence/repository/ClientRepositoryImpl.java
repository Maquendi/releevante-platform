package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.CartRepository;
import com.releevante.core.domain.repository.ClientRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class ClientRepositoryImpl implements ClientRepository {

  final ClientHibernateDao clientHibernateDao;

  final CartRepository cartRepository;

  final ServiceRatingHibernateDao serviceRatingHibernateDao;

  final BookLoanHibernateDao bookLoanHibernateDao;

  final BookRatingHibernateDao bookRatingHibernateDao;

  final BookSaleHibernateDao bookSaleHibernateDao;

  public ClientRepositoryImpl(
      ClientHibernateDao clientHibernateDao,
      CartRepository cartRepository,
      ServiceRatingHibernateDao serviceRatingHibernateDao,
      BookLoanHibernateDao bookLoanHibernateDao,
      BookRatingHibernateDao bookRatingHibernateDao,
      BookSaleHibernateDao bookSaleHibernateDao) {
    this.clientHibernateDao = clientHibernateDao;
    this.cartRepository = cartRepository;
    this.serviceRatingHibernateDao = serviceRatingHibernateDao;
    this.bookLoanHibernateDao = bookLoanHibernateDao;
    this.bookRatingHibernateDao = bookRatingHibernateDao;
    this.bookSaleHibernateDao = bookSaleHibernateDao;
  }

  @Override
  public Mono<Client> find(ClientId clientId) {
    return Mono.justOrEmpty(clientHibernateDao.findById(clientId.value()))
        .map(ClientRecord::toDomain);
  }

  @Override
  public Mono<Client> saveServiceRating(Client client) {
    return Mono.just(ClientRecord.serviceRating(client))
        .map(clientHibernateDao::save)
        .thenReturn(client);
  }

  @Override
  public Mono<Client> saveBookLoan(Client client) {
    return Mono.fromCallable(() -> ClientRecord.bookLoans(client))
        .map(clientHibernateDao::save)
        .thenReturn(client);
  }

  @Override
  public Mono<Client> saveBookRating(Client client) {
    return Mono.fromCallable(() -> ClientRecord.bookRatings(client))
        .map(clientHibernateDao::save)
        .thenReturn(client);
  }

  @Override
  public Mono<Client> savePurchase(Client client) {
    return Mono.fromCallable(() -> ClientRecord.bookPurchases(client))
        .map(clientHibernateDao::save)
        .thenReturn(client);
  }

  @Override
  public Mono<Client> saveReservations(Client client) {
    return Mono.fromCallable(() -> ClientRecord.bookReservations(client))
        .map(clientHibernateDao::save)
        .thenReturn(client);
  }

  @Override
  public Mono<Client> saveCarts(Client client) {
    return Mono.fromCallable(() -> ClientRecord.carts(client))
        .map(clientHibernateDao::save)
        .thenReturn(client);
  }
}
