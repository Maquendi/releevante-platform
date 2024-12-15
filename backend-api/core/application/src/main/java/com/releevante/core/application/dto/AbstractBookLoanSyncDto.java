package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.*;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoanSyncDto.class)
@JsonSerialize(as = BookLoanSyncDto.class)
@ImmutableExt
public abstract class AbstractBookLoanSyncDto {
  abstract String externalId();

  abstract Optional<String> id();

  abstract List<LoanItem> items();

  abstract Optional<ZonedDateTime> returnsAt();

  abstract Optional<ZonedDateTime> createdAt();

  abstract List<LoanStatus> status();

  public BookLoan toDomain(AccountPrincipal principal, Slid slid) {
    return BookLoan.builder()
        .origin(slid.value())
        .externalId(BookLoanId.of(externalId()))
        .id(id().map(BookLoanId::of).orElse(BookLoanId.of(UuidGenerator.instance().next())))
        .isNew(id().isEmpty())
        .createdAt(createdAt())
        .returnsAt(returnsAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .loanStatus(status())
        .items(items())
        .build();
  }
}
