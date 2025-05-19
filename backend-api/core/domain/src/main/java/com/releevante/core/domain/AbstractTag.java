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
@JsonInclude(JsonInclude.Include.NON_ABSENT)
public abstract class AbstractTag {
  abstract String id();

  abstract Optional<String> isbn();

  abstract Optional<String> bookTagId();

  abstract String name();

  abstract TagValue value();

  @Value.Default
  ZonedDateTime createdAt() {
    return ZonedDateTime.now();
  }
}
