package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.BookReservationItem;
import com.releevante.core.domain.identity.model.OrgId;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookReservationRepository {

  Mono<String> saveReservation(BookReservation reservation);

  Mono<BookReservation> getCurrentByClient(String clientId);

  Mono<String> addNewItems(String reservationId, List<BookReservationItem> items);

  Mono<Boolean> removeItems(String reservationId, List<String> items);

  Flux<BookReservation> findAll(OrgId orgId);
}
