package com.releevante.asset.mgmt.application.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Organization.class)
@JsonSerialize(as = Organization.class)
@ImmutableExt
public abstract class AbstractOrganization {
  abstract String orgId();
}
