package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookReservationHibernateDao;
import com.releevante.core.adapter.persistence.dao.BookReservationItemHibernateDao;
import com.releevante.core.adapter.persistence.records.BookReservationItemsRecord;
import com.releevante.core.adapter.persistence.records.BookReservationRecord;
import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.BookReservationItem;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.repository.BookReservationRepository;
import com.releevante.types.exceptions.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookReservationRepositoryImpl implements BookReservationRepository {
  final BookReservationHibernateDao bookReservationHibernateDao;
  final BookReservationItemHibernateDao bookReservationItemHibernateDao;

  public BookReservationRepositoryImpl(
      BookReservationHibernateDao bookReservationHibernateDao,
      BookReservationItemHibernateDao bookReservationItemHibernateDao) {
    this.bookReservationHibernateDao = bookReservationHibernateDao;
    this.bookReservationItemHibernateDao = bookReservationItemHibernateDao;
  }

  @Transactional
  @Override
  public Mono<String> saveReservation(BookReservation reservation) {
    return bookReservationHibernateDao
        .save(BookReservationRecord.fromDomain(reservation))
        .flatMapMany(res -> bookReservationItemHibernateDao.saveAll(res.getReservationItems()))
        .collectList()
        .thenReturn(reservation.id());
  }

  @Override
  public Mono<BookReservation> getCurrentByClient(String clientId) {
    return bookReservationHibernateDao
        .findFirstByClientIdOrderByCreatedAtDesc(clientId)
        .flatMap(
            reservationRecord ->
                bookReservationItemHibernateDao
                    .findAllByReservationId(reservationRecord.getId())
                    .collectList()
                    .map(
                        items -> {
                          reservationRecord.getReservationItems().addAll(items);
                          return reservationRecord.toDomain();
                        }))
        .switchIfEmpty(Mono.error(new ResourceNotFoundException()));
  }

  @Override
  public Flux<BookReservation> getALLByClient(String clientId) {
    return bookReservationHibernateDao
        .findAllByClientIdOrderByCreatedAtDesc(clientId)
        .flatMap(
            reservationRecord ->
                bookReservationItemHibernateDao
                    .findAllByReservationId(reservationRecord.getId())
                    .collectList()
                    .map(
                        items -> {
                          reservationRecord.getReservationItems().addAll(items);
                          return reservationRecord.toDomain();
                        }));
  }

  @Override
  public Mono<String> addNewItems(String reservationId, List<BookReservationItem> items) {
    return bookReservationItemHibernateDao
        .saveAll(BookReservationItemsRecord.fromDomain(reservationId, items))
        .collectList()
        .thenReturn(reservationId);
  }

  @Override
  public Mono<Boolean> removeItems(String reservationId, List<String> items) {
    return bookReservationItemHibernateDao.deleteAllFrom(items).thenReturn(true);
  }

  @Override
  public Flux<BookReservation> findAll(OrgId orgId) {
    return null;
  }
}
