package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.*;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
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

  public BookTransaction toDomain(
      AccountPrincipal principal, SequentialGenerator<String> uuidGenerator) {
    var transactionId = TransactionId.of(uuidGenerator.next());
    return BookTransaction.builder()
        .id(transactionId)
        .externalId(TransactionId.of(transactionId()))
        .transactionType(transactionType())
        .createdAt(createdAt())
        .items(
            items().stream().map(item -> item.toDomain(uuidGenerator)).collect(Collectors.toList()))
        .origin(principal.audience())
        .audit(clientId())
        .build();
  }

  public Client toClient(AccountPrincipal principal, SequentialGenerator<String> uuidGenerator) {
    return Client.builder()
        .id(ClientId.of(clientId()))
        .transactions(List.of(toDomain(principal, uuidGenerator)))
        .build();
  }
}
