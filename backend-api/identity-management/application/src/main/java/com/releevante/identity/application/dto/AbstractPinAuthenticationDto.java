package com.releevante.identity.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = PinAuthenticationDto.class)
@JsonSerialize(as = PinAuthenticationDto.class)
@ImmutableExt
public abstract class AbstractPinAuthenticationDto {
  abstract LoginTokenDto token();

  abstract String orgId();

  abstract String userId();

  public static PinAuthenticationDto from(LoginTokenDto tokenDto, SmartLibraryAccess access) {
    return PinAuthenticationDto.builder()
        .token(tokenDto)
        .userId(access.userId())
        .orgId(access.orgId().value())
        .build();
  }
}
