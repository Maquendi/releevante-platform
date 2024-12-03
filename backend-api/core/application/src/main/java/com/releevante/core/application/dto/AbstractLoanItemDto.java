package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.LoanItem;
import com.releevante.core.domain.LoanItemStatus;
import com.releevante.types.ImmutableObject;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoanItemDto.class)
@JsonSerialize(as = LoanItemDto.class)
@ImmutableObject
public abstract class AbstractLoanItemDto {
  abstract String id();

  abstract String cpy();

  abstract List<LoanItemStatus> status();

  public LoanItem toDomain() {
    return LoanItem.builder().id(id()).cpy(cpy()).status(status()).build();
  }
}
