package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = Category.class)
@JsonSerialize(as = Category.class)
public abstract class AbstractCategory {
  abstract String id();

  abstract String en();

  abstract String fr();

  abstract String es();

  abstract List<SubCategoryRelation> subCategoryRelations();
}
