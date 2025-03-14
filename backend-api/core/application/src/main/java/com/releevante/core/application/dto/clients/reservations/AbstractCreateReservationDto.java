package com.releevante.core.application.dto.clients.reservations;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.ClientId;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = CreateReservationDto.class)
@JsonSerialize(as = CreateReservationDto.class)
public abstract class AbstractCreateReservationDto {
  abstract String clientId();

  abstract List<ReservationItemDto> items();

  public BookReservation toDomain(
      String accessId,
      ZonedDateTime startTime,
      ZonedDateTime endTime,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return BookReservation.builder()
        .id(uuidGenerator.next())
        .clientId(ClientId.of(accessId))
        .createdAt(dateTimeGenerator.next())
        .updateAt(dateTimeGenerator.next())
        .startTime(startTime)
        .endTime(endTime)
        .items(items().stream().map(item -> item.toDomain(uuidGenerator)).toList())
        .build();
  }
}
