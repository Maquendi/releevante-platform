package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookTransaction;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionDto.class)
@JsonSerialize(as = TransactionDto.class)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractTransactionDto {
  abstract String id();

  public static TransactionDto from(BookTransaction transaction) {
    return TransactionDto.builder().id(transaction.id().value()).build();
  }
}
