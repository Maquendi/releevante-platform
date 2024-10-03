package com.releevante.types.exceptions;

public class UserUnauthorizedException extends RuntimeException {
  public UserUnauthorizedException() {
    super("Unauthorized");
  }
}
