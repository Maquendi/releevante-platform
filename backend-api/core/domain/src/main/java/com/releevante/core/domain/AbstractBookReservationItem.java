package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookReservationItem.class)
@JsonSerialize(as = BookReservationItem.class)
@ImmutableExt
public abstract class AbstractBookReservationItem {
  abstract String id();

  abstract Integer qty();

  abstract BookEdition book();
}
