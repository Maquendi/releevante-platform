package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookEdition.class)
@JsonSerialize(as = BookEdition.class)
@ImmutableExt
public abstract class AbstractBookEdition {
  abstract Isbn isbn();

  abstract String title();

  abstract BigDecimal price();
}
