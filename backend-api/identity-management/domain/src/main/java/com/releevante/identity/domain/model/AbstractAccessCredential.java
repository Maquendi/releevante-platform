package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccessCredential.class)
@JsonSerialize(as = AccessCredential.class)
@ImmutableExt
public abstract class AbstractAccessCredential {
  abstract String key();

  abstract String value();

  public static AccessCredential from(
      String credentialType, String credential, PasswordEncoder encoder) {
    return AccessCredential.builder().key(credentialType).value(encoder.encode(credential)).build();
  }
}
