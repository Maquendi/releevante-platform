package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookReservationDto.class)
@JsonSerialize(as = BookReservationDto.class)
@ImmutableExt
public abstract class AbstractBookReservationDto {
  abstract String id();

  abstract ZonedDateTime startTime();

  abstract ZonedDateTime endTime();

  abstract List<BookReservationItemDto> items();
}
