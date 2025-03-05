package com.releevante.types.exceptions;

public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException() {
    super("resource not found");
  }
}
