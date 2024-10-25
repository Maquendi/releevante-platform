package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = PinLoginDto.class)
@JsonSerialize(as = PinLoginDto.class)
@ImmutableExt
public abstract class AbstractPinLoginDto {
  abstract String accessCode();
}
