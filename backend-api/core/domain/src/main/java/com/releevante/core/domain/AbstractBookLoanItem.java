package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoanItem.class)
@JsonSerialize(as = BookLoanItem.class)
@ImmutableExt
public abstract class AbstractBookLoanItem {
  abstract BookEdition bookEdition();

  abstract Integer qty();
}
