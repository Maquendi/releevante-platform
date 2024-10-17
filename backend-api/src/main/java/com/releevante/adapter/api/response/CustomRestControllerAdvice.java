package com.releevante.adapter.api.response;

import com.releevante.types.exceptions.ConfigurationException;
import com.releevante.types.exceptions.ForbiddenException;
import com.releevante.types.exceptions.InvalidInputException;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomRestControllerAdvice {

  @ExceptionHandler(UserUnauthorizedException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public CustomApiResponse<Map<String, Object>> unAuthorized(Throwable e) {
    return CustomApiResponse.from(HttpStatus.UNAUTHORIZED.value(), Map.of("message", e.getMessage()));
  }

  @ExceptionHandler(ConfigurationException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public CustomApiResponse<Map<String, Object>> configuration(Throwable e) {
    return CustomApiResponse.from(HttpStatus.INTERNAL_SERVER_ERROR.value(), Map.of("message", e.getMessage()));
  }

  @ExceptionHandler(ForbiddenException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public CustomApiResponse<Map<String, Object>> forbidden(Throwable e) {
    return CustomApiResponse.from(HttpStatus.FORBIDDEN.value(), Map.of("message", e.getMessage()));
  }

  @ExceptionHandler(InvalidInputException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public CustomApiResponse<Map<String, Object>> badRequest(Throwable e) {
    return CustomApiResponse.from(HttpStatus.BAD_REQUEST.value(), Map.of("message", e.getMessage()));
  }

  @ExceptionHandler(Throwable.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public CustomApiResponse<Map<String, Object>> exceptions(Throwable e) {
    return CustomApiResponse.from(HttpStatus.INTERNAL_SERVER_ERROR.value(), Map.of("message", e.getMessage()));
  }
}
