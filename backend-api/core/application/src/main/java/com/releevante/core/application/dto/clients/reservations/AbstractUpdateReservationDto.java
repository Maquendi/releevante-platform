package com.releevante.core.application.dto.clients.reservations;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookReservationItem;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = UpdateReservationDto.class)
@JsonSerialize(as = UpdateReservationDto.class)
public abstract class AbstractUpdateReservationDto {
  abstract List<ReservationItemDto> items();

  public List<BookReservationItem> toDomain(SequentialGenerator<String> uuidGenerator) {
    return items().stream().map(item -> item.toDomain(uuidGenerator)).toList();
  }
}
