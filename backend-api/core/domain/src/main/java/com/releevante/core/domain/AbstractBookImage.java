package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookImage.class)
@JsonSerialize(as = BookImage.class)
@ImmutableExt
public abstract class AbstractBookImage {
  abstract String id();

  abstract String isbn();

  abstract String url();

  abstract String sourceUrl();
}
