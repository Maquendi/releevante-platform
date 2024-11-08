package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import com.releevante.core.domain.ClientId;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoanDto.class)
@JsonSerialize(as = BookLoanDto.class)
@ImmutableExt
public abstract class AbstractBookLoanDto {
  abstract String loanId();

  abstract String clientId();

  abstract CartDto cartDto();

  abstract ZonedDateTime startTime();

  abstract ZonedDateTime endTime();

  public BookLoan toDomain(Slid slid) {
    return BookLoan.builder()
        .slid(slid)
        .id(BookLoanId.of(loanId()))
        .startTime(startTime())
        .endTime(endTime())
        .clientId(ClientId.of(clientId()))
        .cart(() -> cartDto().toDomain(ClientId.of(clientId())))
        .build();
  }
}
