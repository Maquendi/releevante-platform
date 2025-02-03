package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.*;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookLoanUpdateSyncDto.class)
@JsonSerialize(as = BookLoanUpdateSyncDto.class)
@ImmutableExt
public abstract class AbstractBookLoanUpdateSyncDto {
  abstract String id();

  abstract List<LoanItemStatus> itemStatus();

  abstract List<LoanStatus> status();
}
