package com.releevante.core.application.dto.clients;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.*;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = ClientDto.class)
@JsonSerialize(as = ClientDto.class)
public abstract class AbstractClientDto {
  abstract String id();
}
