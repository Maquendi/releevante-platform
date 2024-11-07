package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibraryGrantedAccess.class)
@JsonSerialize(as = SmartLibraryGrantedAccess.class)
@ImmutableExt
public abstract class AbstractSmartLibraryGrantedAccess {
  abstract String credentialType();

  abstract String credentials();

  abstract List<GrantedAccess> access();
}
