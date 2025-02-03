package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookReservationItemDto.class)
@JsonSerialize(as = BookReservationItemDto.class)
@ImmutableExt
public abstract class AbstractBookReservationItemDto {
  abstract String id();

  abstract Integer qty();

  abstract String bookId();
}
