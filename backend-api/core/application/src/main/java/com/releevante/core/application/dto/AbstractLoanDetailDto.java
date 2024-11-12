package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.LoanDetail;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoanDetailDto.class)
@JsonSerialize(as = LoanDetailDto.class)
@ImmutableExt
public abstract class AbstractLoanDetailDto {
  abstract String id();

  abstract String bookCopy();

  public LoanDetail toDomain() {
    return LoanDetail.builder().id(id()).bookCopy(bookCopy()).build();
  }
}
