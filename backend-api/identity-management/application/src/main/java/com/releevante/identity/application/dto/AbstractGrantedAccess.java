package com.releevante.identity.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = GrantedAccess.class)
@JsonSerialize(as = GrantedAccess.class)
@ImmutableExt
public abstract class AbstractGrantedAccess {
  abstract String slid();

  abstract String accessId();

  abstract Integer accessDueDays();

  abstract ZonedDateTime expiresAt();
}
