package com.releevante.identity.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibraryGrantedAccessDto.class)
@JsonSerialize(as = SmartLibraryGrantedAccessDto.class)
@ImmutableExt
public abstract class AbstractSmartLibraryGrantedAccessDto {

  abstract String userId();

  abstract GrantedAccess access();
}
