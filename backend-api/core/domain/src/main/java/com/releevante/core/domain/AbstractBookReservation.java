package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookReservation.class)
@JsonSerialize(as = BookReservation.class)
@ImmutableExt
public abstract class AbstractBookReservation {
  abstract String id();

  abstract BookEdition bookEdition();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime startTime();

  abstract ZonedDateTime endTime();
}
