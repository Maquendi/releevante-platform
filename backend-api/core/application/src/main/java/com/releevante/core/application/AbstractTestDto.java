package com.releevante.core.application;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookCopy;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = TestDto.class)
@JsonSerialize(as = TestDto.class)
@ImmutableExt
public abstract class AbstractTestDto {

  abstract String id();

  abstract BookCopy copy();
}
