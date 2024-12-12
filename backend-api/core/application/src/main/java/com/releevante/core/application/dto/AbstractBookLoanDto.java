package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import com.releevante.core.domain.LoanItem;
import com.releevante.core.domain.LoanStatus;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoanDto.class)
@JsonSerialize(as = BookLoanDto.class)
@ImmutableExt
public abstract class AbstractBookLoanDto {
  abstract String id();

  abstract List<LoanItem> items();

  abstract ZonedDateTime returnsAt();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract ZonedDateTime endTime();

  abstract List<LoanStatus> status();

  public BookLoan toDomain(AccountPrincipal principal, Slid slid) {
    return BookLoan.builder()
        .origin(slid.value())
        .id(BookLoanId.of(id()))
        .isNew(id().isEmpty())
        .createdAt(createdAt())
        .updatedAt(updatedAt())
        .returnsAt(returnsAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .loanStatus(status())
        .items(items())
        .build();
  }
}
