package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Book.class)
@JsonSerialize(as = Book.class)
@ImmutableExt
public abstract class AbstractBook {
  abstract Isbn isbn();

  abstract String title();

  abstract BigDecimal price();

  abstract LazyLoaderInit<List<BookRating>> ratings();
}
