package com.releevante.adapter.api.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@SuppressWarnings("unchecked")
public class CustomApiResponse<T> {

  @Schema(defaultValue = "200", description = "response http status code")
  int statusCode;

  ResponseContext<T> context;

  public static <E> CustomApiResponse<E> from(Integer status, E data) {
    var context = ResponseContext.builder().data(data).build();
    return (CustomApiResponse<E>)
        CustomApiResponse.builder().statusCode(status).context(context).build();
  }

  public static <E> CustomApiResponse<E> from(E data) {
    var context = ResponseContext.builder().data(data).build();
    return (CustomApiResponse<E>)
        CustomApiResponse.builder().statusCode(200).context(context).build();
  }
}
