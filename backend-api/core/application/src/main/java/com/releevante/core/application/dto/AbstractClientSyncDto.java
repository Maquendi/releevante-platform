package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ClientSyncDto.class)
@JsonSerialize(as = ClientSyncDto.class)
@ImmutableExt
public abstract class AbstractClientSyncDto {
  abstract String id();

  abstract BookLoanSyncDto loan();
}
