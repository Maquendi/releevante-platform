package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.utils.HashUtils;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccessCredential.class)
@JsonSerialize(as = AccessCredential.class)
@ImmutableExt
public abstract class AbstractAccessCredential {
  abstract AccessCredentialKey key();

  abstract AccessCredentialValue value();

  public static AccessCredential from(String credentialType, String credential) {
    return AccessCredential.builder()
        .key(AccessCredentialKey.of(credentialType))
        .value(AccessCredentialValue.of(HashUtils.createSHAHash(credential)))
        .build();
  }
}
