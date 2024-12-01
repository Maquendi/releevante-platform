package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UpdateCartDto.class)
@JsonSerialize(as = UpdateCartDto.class)
@ImmutableExt
public abstract class AbstractUpdateCartDto {
  abstract String cartId();

  abstract List<UpdateCartItemDto> updateItems();

  abstract List<CreateCartItemDto> createItems();
}
