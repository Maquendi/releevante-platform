package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = CartItemDto.class)
@JsonSerialize(as = CartItemDto.class)
@ImmutableExt
public abstract class AbstractCartItemDto {

  abstract String isbn();

  abstract Integer qty();

  abstract BigDecimal itemPrice();
}
