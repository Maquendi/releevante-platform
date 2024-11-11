package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoanDetail.class)
@JsonSerialize(as = LoanDetail.class)
@ImmutableExt
public abstract class AbstractLoanDetail {
  abstract String id();

  abstract String bookCopy();
}
