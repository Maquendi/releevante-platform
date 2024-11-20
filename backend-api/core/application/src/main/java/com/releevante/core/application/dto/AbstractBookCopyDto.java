package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookCopy;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookCopyDto.class)
@JsonSerialize(as = BookCopyDto.class)
@ImmutableExt
public abstract class AbstractBookCopyDto {
  abstract String id();

  abstract String isbn();

  abstract BigDecimal price();

  public static BookCopyDto from(BookCopy copy) {
    return BookCopyDto.builder()
        .id(copy.id().value())
        .isbn(copy.isbn().value())
        .price(copy.price())
        .build();
  }
}
