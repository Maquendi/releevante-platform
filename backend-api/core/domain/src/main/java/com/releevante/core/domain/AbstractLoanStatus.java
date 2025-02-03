package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoanStatus.class)
@JsonSerialize(as = LoanStatus.class)
@ImmutableExt
public abstract class AbstractLoanStatus {
  abstract String id();

  abstract BookLoanStatusValues status();

  abstract ZonedDateTime createdAt();
}
