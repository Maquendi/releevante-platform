package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Cart;
import com.releevante.core.domain.CartId;
import com.releevante.core.domain.CartState;
import com.releevante.core.domain.ClientId;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = CartDto.class)
@JsonSerialize(as = CartDto.class)
@ImmutableExt
public abstract class AbstractCartDto {
  abstract String id();

  abstract CartStateDto cartState();

  abstract List<CartItemDto> cartItems();

  abstract ZonedDateTime createdAt();

  public boolean isCheckedOut() {
    return this.cartState().equals(CartStateDto.CHECKED_OUT);
  }

  public Cart toDomain(ClientId clientId) {

    return Cart.builder()
        .id(CartId.of(id()))
        .clientId(clientId)
        .createAt(createdAt())
        .updatedAt(createdAt())
        .items(() -> cartItems().stream().map(CartItemDto::toDomain).collect(Collectors.toList()))
        .state(CartState.of(cartState().name()))
        .build();
  }
}
