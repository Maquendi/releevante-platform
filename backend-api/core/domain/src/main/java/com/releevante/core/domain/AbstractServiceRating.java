package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.Auditable;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ServiceRating.class)
@JsonSerialize(as = ServiceRating.class)
@ImmutableExt
public abstract class AbstractServiceRating implements Auditable {
  abstract String id();

  abstract Integer rating();
}
