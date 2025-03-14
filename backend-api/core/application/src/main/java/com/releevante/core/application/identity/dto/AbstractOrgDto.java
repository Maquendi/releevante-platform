package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = OrgDto.class)
@JsonSerialize(as = OrgDto.class)
@ImmutableExt
public abstract class AbstractOrgDto {
  abstract AccountDto account();

  abstract String name();

  abstract String type();
}
