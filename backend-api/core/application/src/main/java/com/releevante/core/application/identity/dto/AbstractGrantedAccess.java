package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = GrantedAccess.class)
@JsonSerialize(as = GrantedAccess.class)
@ImmutableExt
public abstract class AbstractGrantedAccess {
  abstract String accessId();

  public static GrantedAccess from(SmartLibraryAccess access) {
    return GrantedAccess.builder().accessId(access.id()).build();
  }
}
