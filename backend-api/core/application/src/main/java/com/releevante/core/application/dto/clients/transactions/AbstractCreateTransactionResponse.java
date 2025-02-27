package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.TransactionItem;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = CreateTransactionResponse.class)
@JsonSerialize(as = CreateTransactionResponse.class)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractCreateTransactionResponse {
  abstract String id();

  abstract List<String> itemIds();

  public static CreateTransactionResponse from(Client client) {
    return client.transactions().stream()
        .findFirst()
        .map(
            transaction ->
                CreateTransactionResponse.builder()
                    .id(transaction.id().value())
                    .itemIds(transaction.items().stream().map(TransactionItem::id).toList())
                    .build())
        .orElseThrow();
  }
}
