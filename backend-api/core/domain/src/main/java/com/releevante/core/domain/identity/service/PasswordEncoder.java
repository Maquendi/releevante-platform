/* (C)2024 */
package com.releevante.core.domain.identity.service;

public interface PasswordEncoder {
  String encode(String rawPassword);

  boolean validate(String rawPassword, String hash);
}
