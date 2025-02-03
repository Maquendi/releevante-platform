package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.Auditable;
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
public abstract class AbstractBookLoan implements Auditable {
  abstract BookLoanId id();

  abstract BookLoanId externalId();

  /** estimated time for book return */
  abstract Optional<ZonedDateTime> returnsAt();

  abstract Optional<ZonedDateTime> createdAt();

  @Value.Default
  Boolean isNew() {
    return true;
  }

  @Value.Default
  List<LoanItem> items() {
    return Collections.emptyList();
  }

  @Value.Default
  List<LoanStatus> loanStatus() {
    return Collections.emptyList();
  }
}
