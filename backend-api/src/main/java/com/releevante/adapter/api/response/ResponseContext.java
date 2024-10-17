package com.releevante.adapter.api.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ResponseContext<T> {
  T data;
}
