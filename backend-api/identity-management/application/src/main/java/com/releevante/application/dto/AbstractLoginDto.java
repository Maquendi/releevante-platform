package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoginDto.class)
@JsonSerialize(as = LoginDto.class)
@ImmutableExt
public abstract class AbstractLoginDto {
  abstract String userName();

  abstract String password();
}
