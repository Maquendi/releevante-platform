package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = SubCategoryRelation.class)
@JsonSerialize(as = SubCategoryRelation.class)
public abstract class AbstractSubCategoryRelation {
  abstract String id();

  abstract List<String> bookRelations();
}
