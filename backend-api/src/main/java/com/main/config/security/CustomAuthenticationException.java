package com.main.config.security;

import com.releevante.types.exceptions.UserUnauthorizedException;
import org.springframework.security.core.AuthenticationException;

public class CustomAuthenticationException extends AuthenticationException {
  public CustomAuthenticationException(UserUnauthorizedException exception) {
    super(exception.getMessage());
  }

  public CustomAuthenticationException() {
    super("Unauthorized");
  }

  public CustomAuthenticationException(String message) {
    super(message);
  }
}
