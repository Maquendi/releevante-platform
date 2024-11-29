package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookCpy.class)
@JsonSerialize(as = BookCpy.class)
@ImmutableExt
public abstract class AbstractBookCpy {
  abstract String id();

  abstract boolean isSync();

  abstract BookCopyStatus status();
}
