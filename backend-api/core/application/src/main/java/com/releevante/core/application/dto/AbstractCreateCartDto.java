package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = CreateCartDto.class)
@JsonSerialize(as = CreateCartDto.class)
@ImmutableExt
public abstract class AbstractCreateCartDto {
  abstract List<CreateCartItemDto> cartItems();
}
