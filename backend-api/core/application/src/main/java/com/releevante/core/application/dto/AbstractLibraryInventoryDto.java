package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LibraryInventoryDto.class)
@JsonSerialize(as = LibraryInventoryDto.class)
@ImmutableExt
public abstract class AbstractLibraryInventoryDto {

  abstract String bookId();

  abstract String title();

  abstract int qty();
}
