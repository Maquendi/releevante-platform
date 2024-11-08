package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookEdition;
import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.LazyLoader;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookEditionDto.class)
@JsonSerialize(as = BookEditionDto.class)
@ImmutableExt
public abstract class AbstractBookEditionDto {
  abstract String isbn();

  abstract String title();

  public LazyLoader<BookEdition> toDomain() {
    return () ->
        BookEdition.builder().isbn(Isbn.of(isbn())).title(title()).price(BigDecimal.ZERO).build();
  }
}
