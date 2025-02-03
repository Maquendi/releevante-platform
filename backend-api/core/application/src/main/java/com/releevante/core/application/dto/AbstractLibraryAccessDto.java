package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = LibraryAccessDto.class)
@JsonSerialize(as = LibraryAccessDto.class)
public abstract class AbstractLibraryAccessDto {
  abstract String userId();

  abstract AccessDto accesses();
}
