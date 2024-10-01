/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = M2MClient.class)
@JsonSerialize(as = M2MClient.class)
@ImmutableExt
public abstract class AbstractM2MClient {
  abstract String clientId();

  abstract String clientSecret();

  abstract String orgId();

  abstract boolean isActive();
}
