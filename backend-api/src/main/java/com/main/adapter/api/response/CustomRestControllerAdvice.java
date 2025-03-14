package com.main.adapter.api.response;

import com.releevante.types.exceptions.*;
import java.util.Map;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomRestControllerAdvice {

  @ExceptionHandler(UserUnauthorizedException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public CustomApiResponse<Map<String, Object>> unAuthorized(Throwable e) {
    return wrapResponse(HttpStatus.UNAUTHORIZED, e);
  }

  @ExceptionHandler(ConfigurationException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public CustomApiResponse<Map<String, Object>> configuration(Throwable e) {
    return wrapResponse(HttpStatus.INTERNAL_SERVER_ERROR, e);
  }

  @ExceptionHandler(ForbiddenException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public CustomApiResponse<Map<String, Object>> forbidden(Throwable e) {
    return wrapResponse(HttpStatus.FORBIDDEN, e);
  }

  @ExceptionHandler(InvalidInputException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public CustomApiResponse<Map<String, Object>> badRequest(Throwable e) {
    return wrapResponse(HttpStatus.BAD_REQUEST, e);
  }

  @ExceptionHandler(DuplicateKeyException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public CustomApiResponse<Map<String, Object>> badRequestV2(Throwable e) {
    return wrapResponse(HttpStatus.BAD_REQUEST, e);
  }

  @ExceptionHandler(Throwable.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public CustomApiResponse<Map<String, Object>> exceptions(Throwable e) {
    return wrapResponse(HttpStatus.INTERNAL_SERVER_ERROR, e);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public CustomApiResponse<Map<String, Object>> exceptions(ResourceNotFoundException e) {
    return wrapResponse(HttpStatus.NOT_FOUND, e);
  }

  private CustomApiResponse<Map<String, Object>> wrapResponse(HttpStatus status, Throwable ex) {
    return CustomApiResponse.from(status.value(), Map.of("message", ex.getMessage()));
  }
}
