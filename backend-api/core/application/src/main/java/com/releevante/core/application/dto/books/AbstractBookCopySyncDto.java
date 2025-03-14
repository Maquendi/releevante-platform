package com.releevante.core.application.dto.books;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookCopyStatus;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookDto.class)
@JsonSerialize(as = BookDto.class)
@ImmutableExt
public abstract class AbstractBookCopySyncDto {
  abstract String id();

  abstract BookCopyStatus status();

  abstract Integer usageCount();
}
