package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = GuestLoginDto.class)
@JsonSerialize(as = GuestLoginDto.class)
@ImmutableExt
public abstract class AbstractGuestLoginDto {
  abstract String accessId();
}
