package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookReservationRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface BookReservationHibernateDao
    extends ReactiveCrudRepository<BookReservationRecord, String> {
  Mono<BookReservationRecord> findFirstByClientIdOrderByCreatedAtDesc(String clientId);

  Flux<BookReservationRecord> findAllByClientIdOrderByCreatedAtDesc(String clientId);
}
