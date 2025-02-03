package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookLoanStatusValues;
import com.releevante.core.domain.LoanStatus;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoanStatusDto.class)
@JsonSerialize(as = BookLoanStatusDto.class)
@ImmutableExt
public abstract class AbstractBookLoanStatusDto {
  abstract String id();

  abstract BookLoanStatusValues status();

  abstract ZonedDateTime createdAt();

  public LoanStatus toDomain() {
    return LoanStatus.builder().status(status()).id(id()).createdAt(createdAt()).build();
  }
}
