package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.BookCopyId;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookCopy.class)
@JsonSerialize(as = BookCopy.class)
@ImmutableExt
public abstract class AbstractBookCopy {
  abstract BookCopyId id();

  abstract Isbn isbn();

  abstract String title();

  abstract Slid slid();

  abstract Boolean isSync();

  abstract BigDecimal price();

  abstract BookCopyStatus status();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();
}
