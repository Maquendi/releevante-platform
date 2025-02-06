package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.BookReservationItem;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
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

  abstract List<BookReservationItem> items();

  public BookReservation toDomain(
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return BookReservation.builder()
        .id(uuidGenerator.next())
        .createdAt(dateTimeGenerator.next())
        .updateAt(dateTimeGenerator.next())
        .startTime(startTime())
        .endTime(endTime())
        .items(items())
        .build();
  }
}
