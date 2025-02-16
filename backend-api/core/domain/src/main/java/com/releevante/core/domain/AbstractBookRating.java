package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.Auditable;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookRating.class)
@JsonSerialize(as = BookRating.class)
@ImmutableExt
public abstract class AbstractBookRating implements Auditable {
  abstract String id();

  abstract String isbn();

  abstract int rating();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();
}
