package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionSyncResponse.class)
@JsonSerialize(as = TransactionSyncResponse.class)
public abstract class AbstractTransactionSyncResponse {
  abstract Boolean success();

  public static TransactionSyncResponse from(List<Client> client) {
    return TransactionSyncResponse.builder().success(true).build();
  }
}
