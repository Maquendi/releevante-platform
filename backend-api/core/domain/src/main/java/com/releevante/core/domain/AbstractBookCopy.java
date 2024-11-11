package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.BookCopyId;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookCopy.class)
@JsonSerialize(as = BookCopy.class)
@ImmutableExt
public abstract class AbstractBookCopy {
  abstract BookCopyId id();

  abstract Book book();
}
