package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookReservation.class)
@JsonSerialize(as = BookReservation.class)
@ImmutableExt
public abstract class AbstractBookReservation {

  abstract ClientId clientId();

  abstract String id();

  abstract BookEdition bookEdition();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updateAt();

  abstract ZonedDateTime startTime();

  abstract ZonedDateTime endTime();

  abstract LazyLoader<List<BookReservationItem>> items();
}
