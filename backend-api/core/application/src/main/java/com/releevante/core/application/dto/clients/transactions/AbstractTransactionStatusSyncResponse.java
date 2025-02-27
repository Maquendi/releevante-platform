package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.TransactionItemStatus;
import com.releevante.core.domain.TransactionStatus;
import com.releevante.types.ImmutableExt;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionStatusSyncResponse.class)
@JsonSerialize(as = TransactionStatusSyncResponse.class)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractTransactionStatusSyncResponse {
  abstract Set<String> transactionStatusIdSet();

  abstract Set<String> transactionItemStatusIdSet();

  public static TransactionStatusSyncResponse from(List<Client> clients) {
    var transactionStatusIds = new ArrayList<String>();
    var transactionItemStatusIds = new ArrayList<String>();
    clients.forEach(
        client -> {
          var transactionItemStatusList =
              client.transactionItemStatus().stream()
                  .map(TransactionItemStatus::externalId)
                  .toList();
          var transactionStatusList =
              client.transactionStatus().stream().map(TransactionStatus::externalId).toList();
          transactionStatusIds.addAll(transactionStatusList);
          transactionItemStatusIds.addAll(transactionItemStatusList);
        });

    return TransactionStatusSyncResponse.builder()
        .transactionStatusIdSet(transactionStatusIds)
        .transactionItemStatusIdSet(transactionItemStatusIds)
        .build();
  }
}
