package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UserLoginDto.class)
@JsonSerialize(as = UserLoginDto.class)
@ImmutableExt
public abstract class AbstractUserLoginDto {
  abstract String userName();

  abstract String password();
}
