package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Collections;
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

  abstract int qty();

  abstract String description();

  abstract String author();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  @Value.Default
  List<BookRating> ratings() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookImage> images() {
    return Collections.emptyList();
  }
}
