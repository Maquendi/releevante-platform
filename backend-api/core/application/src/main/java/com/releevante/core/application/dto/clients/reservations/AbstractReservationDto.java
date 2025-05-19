package com.releevante.core.application.dto.clients.reservations;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookReservation;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = ReservationDto.class)
@JsonSerialize(as = ReservationDto.class)
public abstract class AbstractReservationDto {

  abstract String id();

  abstract ZonedDateTime createdAt();

  abstract List<ReservationItemDto> items();

  public static ReservationDto from(BookReservation reservation) {
    return ReservationDto.builder()
        .createdAt(reservation.createdAt())
        .items(reservation.items().stream().map(ReservationItemDto::fromDomain).toList())
        .id(reservation.id())
        .build();
  }
}
