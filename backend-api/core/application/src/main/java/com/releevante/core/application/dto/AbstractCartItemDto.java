package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.CartItem;
import com.releevante.types.BookCopyId;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = CartItemDto.class)
@JsonSerialize(as = CartItemDto.class)
@ImmutableExt
public abstract class AbstractCartItemDto {
  abstract String id();

  abstract String bookId();

  abstract Integer qty();

  abstract BookEditionDto editionDto();

  abstract BigDecimal itemPrice();

  public CartItem toDomain() {
    return CartItem.builder()
        .itemPrice(itemPrice())
        .bookCopyId(BookCopyId.of(bookId()))
        .book(editionDto().toDomain())
        .qty(qty())
        .build();
  }
}
