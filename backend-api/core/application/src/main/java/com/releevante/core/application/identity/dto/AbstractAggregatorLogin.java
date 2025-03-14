package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableObject;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AggregatorLogin.class)
@JsonSerialize(as = AggregatorLogin.class)
@ImmutableObject
public abstract class AbstractAggregatorLogin {
  abstract String slid();
}
