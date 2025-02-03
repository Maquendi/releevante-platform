package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = SubCategory.class)
@JsonSerialize(as = SubCategory.class)
public abstract class AbstractSubCategory {
  abstract String id();

  abstract String en();

  abstract String fr();

  abstract String es();
}
