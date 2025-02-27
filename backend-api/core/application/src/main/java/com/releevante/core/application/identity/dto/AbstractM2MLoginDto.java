package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = M2MLoginDto.class)
@JsonSerialize(as = M2MLoginDto.class)
@ImmutableExt
public abstract class AbstractM2MLoginDto {
  abstract String clientId();
}
