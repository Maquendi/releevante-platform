package com.main.adapter.api.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HttpErrorResponse {
  @Schema(
      defaultValue = "0",
      description = "response http status code",
      allowableValues = {"401", "403", "500"})
  int statusCode;

  ResponseContext<HttpError> context;
}
