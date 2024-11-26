package com.releevante.identity.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = GrantedAccess.class)
@JsonSerialize(as = GrantedAccess.class)
@ImmutableExt
public abstract class AbstractGrantedAccess {
  abstract String userId();

  abstract String accessId();

  abstract Integer accessDueDays();

  abstract ZonedDateTime expiresAt();

  public static GrantedAccess from(SmartLibraryAccess access) {
    return GrantedAccess.builder()
        .accessId(access.id())
        .userId(access.userId())
        .accessDueDays(access.accessDueDays())
        .expiresAt(access.expiresAt())
        .build();
  }
}
