package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import java.util.Map;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = BookCategories.class)
@JsonSerialize(as = BookCategories.class)
public abstract class AbstractBookCategories {
  abstract List<Category> categories();

  abstract Map<String, SubCategory> subCategoryMap();
}
