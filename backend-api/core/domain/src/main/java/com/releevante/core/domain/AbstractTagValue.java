package com.releevante.core.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = TagValue.class)
@JsonSerialize(as = TagValue.class)
@ImmutableExt
public abstract class AbstractTagValue {
  abstract String en();

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  abstract Optional<String> fr();

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  abstract Optional<String> es();
}
