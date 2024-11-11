package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Cart.class)
@JsonSerialize(as = Cart.class)
@ImmutableExt
public abstract class AbstractCart {
  abstract CartId id();

  abstract ClientId clientId();

  abstract CartState state();

  abstract ZonedDateTime createAt();

  abstract ZonedDateTime updatedAt();

  abstract LazyLoaderInit<List<CartItem>> items();
}
