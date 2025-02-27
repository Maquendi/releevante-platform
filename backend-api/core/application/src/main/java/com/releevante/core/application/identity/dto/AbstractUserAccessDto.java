package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.identity.model.AccessCredential;
import com.releevante.types.ImmutableExt;
import com.releevante.types.exceptions.InvalidInputException;
import com.releevante.types.utils.HashUtils;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UserAccessDto.class)
@JsonSerialize(as = UserAccessDto.class)
@ImmutableExt
public abstract class AbstractUserAccessDto {
  abstract Optional<String> contactLess();

  abstract Optional<String> credential();

  abstract Optional<String> room();

  abstract ZonedDateTime expiresAt();

  public AccessCredential getCredential() {
    if (credential().isEmpty() && contactLess().isEmpty()) {
      throw new InvalidInputException("credential expected");
    }
    return AccessCredential.builder()
        .credential(credential().map(HashUtils::createSHAHash))
        .contactLess(contactLess().map(HashUtils::createSHAHash))
        .build();
  }
}
