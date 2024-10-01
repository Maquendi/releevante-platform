/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = User.class)
@JsonSerialize(as = User.class)
@ImmutableExt
public abstract class AbstractUser {
  abstract String id();

  abstract String nfcHash();

  abstract String fullName();

  abstract String type();

  abstract AccountId accountId();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();
}
