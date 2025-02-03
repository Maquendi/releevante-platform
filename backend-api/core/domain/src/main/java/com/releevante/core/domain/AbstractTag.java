package com.releevante.core.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
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

  abstract Optional<String> isbn();

  abstract Optional<String> bookTagId();

  abstract String name();

  abstract String value();

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  abstract Optional<String> valueFr();

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  abstract Optional<String> valueSp();

  abstract ZonedDateTime createdAt();
}
