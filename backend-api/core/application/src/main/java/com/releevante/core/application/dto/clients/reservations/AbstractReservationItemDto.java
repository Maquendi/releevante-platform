package com.releevante.core.application.dto.clients.reservations;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookReservationItem;
import com.releevante.core.domain.BookTransactionType;
import com.releevante.core.domain.Isbn;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ReservationItemDto.class)
@JsonSerialize(as = ReservationItemDto.class)
@ImmutableExt
public abstract class AbstractReservationItemDto {
  abstract Integer qty();

  abstract String isbn();

  abstract BookTransactionType transactionType();

  public BookReservationItem toDomain(SequentialGenerator<String> uuidGenerator) {
    return BookReservationItem.builder()
        .id(uuidGenerator.next())
        .transactionType(transactionType())
        .isbn(Isbn.of(isbn()))
        .qty(qty())
        .build();
  }

  public static ReservationItemDto fromDomain(BookReservationItem item) {
    return ReservationItemDto.builder()
        .transactionType(item.transactionType())
        .isbn(item.isbn().value())
        .qty(item.qty())
        .build();
  }
}
