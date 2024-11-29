package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoan.class)
@JsonSerialize(as = BookLoan.class)
@ImmutableExt
public abstract class AbstractBookLoan {
  abstract BookLoanId externalId();

  abstract BookLoanId id();

  /** smart library id */
  abstract String origin();

  /** estimated time for book return */
  abstract ZonedDateTime returnsAt();

  /** actual date when book is returned */
  abstract Optional<ZonedDateTime> returnedAt();

  @Value.Default
  List<LoanDetail> loanDetails() {
    return Collections.emptyList();
  }

  @Value.Default
  List<LoanStatus> loanStatus() {
    return Collections.emptyList();
  }

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  @Value.Default
  Boolean isNew() {
    return true;
  }
}
