package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.application.dto.clients.SyncResponse;
import com.releevante.core.domain.Client;
import com.releevante.types.ImmutableExt;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionSyncResponse.class)
@JsonSerialize(as = TransactionSyncResponse.class)
public abstract class AbstractTransactionSyncResponse {
  abstract SyncResponse transaction();

  abstract List<SyncResponse> items();

  public static List<TransactionSyncResponse> from(Client client) {
    return client.transactions().stream()
        .map(
            transaction ->
                TransactionSyncResponse.builder()
                    .transaction(
                        new SyncResponse(
                            transaction.externalId().value(), transaction.id().value()))
                    .items(
                        transaction.items().stream()
                            .map(
                                transactionItem ->
                                    new SyncResponse(
                                        transactionItem.externalId(), transactionItem.id()))
                            .collect(Collectors.toList()))
                    .build())
        .collect(Collectors.toList());
  }
}
