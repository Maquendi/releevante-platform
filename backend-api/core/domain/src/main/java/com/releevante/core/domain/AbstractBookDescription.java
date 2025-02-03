package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookDescription.class)
@JsonSerialize(as = BookDescription.class)
@ImmutableExt
public abstract class AbstractBookDescription {
  abstract String en();

  abstract String fr();

  abstract String es();
}
