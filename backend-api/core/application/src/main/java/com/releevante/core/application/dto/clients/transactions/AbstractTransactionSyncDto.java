package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.*;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionSyncDto.class)
@JsonSerialize(as = TransactionSyncDto.class)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractTransactionSyncDto {
  abstract String clientId();

  abstract String transactionId();

  abstract BookTransactionType transactionType();

  abstract ZonedDateTime createdAt();

  abstract List<TransactionItemDto> items();

  public BookTransaction toDomain(AccountPrincipal principal) {
    return BookTransaction.builder()
        .id(TransactionId.of(transactionId()))
        .transactionType(transactionType())
        .createdAt(createdAt())
        .items(
            items().stream().map(AbstractTransactionItemDto::toDomain).collect(Collectors.toList()))
        .origin(principal.audience())
        .audit(clientId())
        .build();
  }

  public Client toClient(AccountPrincipal principal) {
    return Client.builder()
        .id(ClientId.of(clientId()))
        .transactions(List.of(toDomain(principal)))
        .build();
  }
}
