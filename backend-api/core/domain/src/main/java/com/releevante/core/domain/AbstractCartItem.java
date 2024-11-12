package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = CartItem.class)
@JsonSerialize(as = CartItem.class)
@ImmutableExt
public abstract class AbstractCartItem {
  abstract String id();

  abstract Isbn isbn();

  abstract Integer qty();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updated();
}
