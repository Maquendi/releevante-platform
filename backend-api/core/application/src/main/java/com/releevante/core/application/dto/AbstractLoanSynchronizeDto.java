package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoanSynchronizeDto.class)
@JsonSerialize(as = LoanSynchronizeDto.class)
@ImmutableExt
public abstract class AbstractLoanSynchronizeDto {

  abstract String slid();

  abstract List<BookLoanDto> loans();
}
