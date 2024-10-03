package com.releevante.adapter.api.response;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ApiResponse.class)
@JsonSerialize(as = ApiResponse.class)
@ImmutableExt
public abstract class AbstractApiResponse {
  abstract int statusCode();

  abstract ResponseContext context();
}
