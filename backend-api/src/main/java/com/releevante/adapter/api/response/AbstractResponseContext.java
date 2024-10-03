package com.releevante.adapter.api.response;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ResponseContext.class)
@JsonSerialize(as = ResponseContext.class)
@ImmutableExt
public abstract class AbstractResponseContext {
  abstract Object data();
}
