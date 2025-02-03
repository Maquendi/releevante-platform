package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = CategoryTag.class)
@JsonSerialize(as = CategoryTag.class)
@ImmutableExt
public abstract class AbstractCategoryTag {
  abstract String en();

  abstract String fr();

  abstract String es();
}
