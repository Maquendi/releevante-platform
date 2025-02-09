package com.releevante.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookCopy.class)
@JsonSerialize(as = BookCopy.class)
@ImmutableExt
public abstract class AbstractBookCopy {
  abstract String id();

  abstract Isbn isbn();

  abstract String title();

  abstract BigDecimal price();

  abstract String correlationId();

  abstract int usageCount();

  abstract String description();

  abstract String descriptionFr();

  abstract String descriptionSp();

  abstract String allocation();

  @JsonIgnore
  abstract Slid slid();

  abstract Boolean isSync();

  abstract String author();

  abstract String language();

  abstract BookCopyStatus status();

  @JsonIgnore
  abstract ZonedDateTime createdAt();

  @JsonIgnore
  abstract ZonedDateTime updatedAt();

  @Value.Default
  List<BookImage> images() {
    return Collections.emptyList();
  }
}
