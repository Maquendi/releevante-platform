package com.releevante.identity.application.dto;

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

  abstract String clientId();

  abstract List<GrantedAccess> access();
}
