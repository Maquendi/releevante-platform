package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LibraryInventory.class)
@JsonSerialize(as = LibraryInventory.class)
@ImmutableExt
public abstract class AbstractLibraryInventory {

  abstract String id();

  abstract String isbn();

  abstract String slid();

  abstract BookCopyStatus status();

  abstract int usageCount();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract Boolean isSync();

  abstract String allocation();
}
