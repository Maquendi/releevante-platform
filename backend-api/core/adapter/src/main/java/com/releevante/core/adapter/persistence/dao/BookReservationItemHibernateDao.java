package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookReservationItemsRecord;
import java.util.List;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface BookReservationItemHibernateDao
    extends ReactiveCrudRepository<BookReservationItemsRecord, String> {
  @Query("DELETE FROM core.book_reservation_items WHERE id in (:ids)")
  Mono<Void> deleteAllFrom(List<String> ids);

  Flux<BookReservationItemsRecord> findAllByReservationId(String reservationId);
}
