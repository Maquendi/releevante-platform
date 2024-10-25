package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibraryAccessDto.class)
@JsonSerialize(as = SmartLibraryAccessDto.class)
@ImmutableExt
public abstract class AbstractSmartLibraryAccessDto {
  abstract LoginTokenDto token();

  abstract String orgId();

  public static SmartLibraryAccessDto from(LoginTokenDto tokenDto, SmartLibraryAccess access) {
    return SmartLibraryAccessDto.builder().token(tokenDto).orgId(access.orgId().value()).build();
  }
}
