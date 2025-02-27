package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionStatusSyncDto.class)
@JsonSerialize(as = TransactionStatusSyncDto.class)
public abstract class AbstractTransactionStatusSyncDto {

  abstract String clientId();

  @Value.Default
  List<TransactionItemStatusDto> transactionItemStatus() {
    return Collections.emptyList();
  }

  @Value.Default
  List<TransactionStatusDto> transactionStatus() {
    return Collections.emptyList();
  }

  public Client toClient(AccountPrincipal principal, SequentialGenerator<String> uuidGenerator) {
    return Client.builder()
        .id(ClientId.of(clientId()))
        .transactionStatus(
            transactionStatus().stream()
                .map(status -> status.toDomain(principal, uuidGenerator))
                .collect(Collectors.toList()))
        .transactionItemStatus(
            transactionItemStatus().stream()
                .map(status -> status.toDomain(principal, uuidGenerator))
                .collect(Collectors.toList()))
        .build();
  }
}
