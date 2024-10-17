package com.releevante.adapter.api.response;

import lombok.Builder;
import lombok.Getter;

// @Value.Immutable()
// @JsonDeserialize(as = ResponseContext.class)
// @JsonSerialize(as = ResponseContext.class)
// @ImmutableExt

@Builder
@Getter
public class ResponseContext<T> {
  T data;
}
