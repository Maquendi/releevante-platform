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

  @ExceptionHandler(Throwable.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public CustomApiResponse<Map<String, Object>> exceptions(Throwable e) {
    return wrapResponse(HttpStatus.INTERNAL_SERVER_ERROR, e);
  }

  private CustomApiResponse<Map<String, Object>> wrapResponse(HttpStatus status, Throwable ex) {
    return CustomApiResponse.from(status.value(), Map.of("message", ex.getMessage()));
  }
}
