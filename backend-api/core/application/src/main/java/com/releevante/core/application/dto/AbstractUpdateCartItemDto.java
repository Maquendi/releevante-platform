package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UpdateCartItemDto.class)
@JsonSerialize(as = UpdateCartItemDto.class)
@ImmutableExt
public abstract class AbstractUpdateCartItemDto implements ICartItem {
  abstract String id();
}
