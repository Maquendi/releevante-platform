package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoan.class)
@JsonSerialize(as = BookLoan.class)
@ImmutableExt
public abstract class AbstractBookLoan {
  abstract BookLoanId id();

  /** smart library id */
  abstract Slid slid();

  /** estimated time for book return */
  abstract ZonedDateTime returnsAt();

  /** actual date when book is returned */
  abstract Optional<ZonedDateTime> returnedAt();

  /** status of this book loan */
  abstract BookLoanStatus status();

  abstract List<LoanDetail> loanDetails();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();
}
