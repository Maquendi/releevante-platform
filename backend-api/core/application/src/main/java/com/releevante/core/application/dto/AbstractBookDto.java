package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.Isbn;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookDto.class)
@JsonSerialize(as = BookDto.class)
@ImmutableExt
public abstract class AbstractBookDto {
  abstract String isbn();

  abstract String title();

  public Book toDomain() {
    return Book.builder().isbn(Isbn.of(isbn())).title(title()).price(BigDecimal.ZERO).build();
  }
}
