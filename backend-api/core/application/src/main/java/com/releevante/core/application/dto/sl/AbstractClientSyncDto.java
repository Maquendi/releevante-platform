package com.releevante.core.application.dto.sl;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.application.dto.clients.ClientDto;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = ClientDto.class)
@JsonSerialize(as = ClientDto.class)
public abstract class AbstractClientSyncDto {
  abstract String id();
}
