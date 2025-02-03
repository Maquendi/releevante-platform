package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import com.releevante.types.UserId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Cart.class)
@JsonSerialize(as = Cart.class)
@ImmutableExt
public abstract class AbstractCart {
  abstract CartId id();

  abstract UserId userId();

  abstract Optional<Slid> slid();

  abstract CartState state();

  abstract ZonedDateTime createAt();

  abstract ZonedDateTime updatedAt();

  abstract List<CartItem> items();
}
