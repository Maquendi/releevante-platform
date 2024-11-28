package com.releevante.core.domain.tags;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Tag.class)
@JsonSerialize(as = Tag.class)
@ImmutableExt
public abstract class AbstractTag {
  abstract String id();

  abstract String name();

  abstract String value();

  abstract Optional<String> valueFr();

  abstract Optional<String> valueSp();

  abstract ZonedDateTime createdAt();
}
