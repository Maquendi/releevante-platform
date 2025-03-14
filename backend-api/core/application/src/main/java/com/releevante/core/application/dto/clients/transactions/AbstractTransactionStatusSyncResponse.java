package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionStatusSyncResponse.class)
@JsonSerialize(as = TransactionStatusSyncResponse.class)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractTransactionStatusSyncResponse {
  abstract Boolean success();

  public static TransactionStatusSyncResponse from(List<Client> clients) {
    return TransactionStatusSyncResponse.builder().success(true).build();
  }
}
