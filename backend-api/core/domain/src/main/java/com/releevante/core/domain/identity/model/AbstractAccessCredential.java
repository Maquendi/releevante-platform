package com.releevante.core.domain.identity.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.utils.HashUtils;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccessCredential.class)
@JsonSerialize(as = AccessCredential.class)
@ImmutableExt
public abstract class AbstractAccessCredential {
  abstract Optional<String> credential();

  abstract Optional<String> contactLess();

  public static AccessCredential from(String credential, String contactLess) {
    return AccessCredential.builder()
        .credential(HashUtils.createSHAHash(credential))
        .contactLess(HashUtils.createSHAHash(contactLess))
        .build();
  }
}
