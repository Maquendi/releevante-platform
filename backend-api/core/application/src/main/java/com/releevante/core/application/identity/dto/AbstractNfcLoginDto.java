package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = NfcLoginDto.class)
@JsonSerialize(as = NfcLoginDto.class)
@ImmutableExt
public abstract class AbstractNfcLoginDto {
  abstract String nfcKey();
}
