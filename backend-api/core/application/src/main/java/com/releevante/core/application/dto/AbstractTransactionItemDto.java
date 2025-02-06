package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.TransactionItem;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionItemDto.class)
@JsonSerialize(as = TransactionItemDto.class)
public abstract class AbstractTransactionItemDto {

  abstract String id();

  abstract String cpy();

  abstract List<TransactionItemStatusDto> status();

  public TransactionItem toDomain(AccountPrincipal principal) {
    return TransactionItem.builder()
        .id(id())
        .cpy(cpy())
        .status(
            status().stream().map(s -> s.toDomain(principal, id())).collect(Collectors.toList()))
        .build();
  }
}
