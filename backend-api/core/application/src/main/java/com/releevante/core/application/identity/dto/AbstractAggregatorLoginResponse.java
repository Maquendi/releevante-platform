package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableObject;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AggregatorLoginResponse.class)
@JsonSerialize(as = AggregatorLoginResponse.class)
@ImmutableObject
public abstract class AbstractAggregatorLoginResponse {
  abstract String token();

  abstract ZonedDateTime expiresAt();
}
