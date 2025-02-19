package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.Auditable;
import com.releevante.types.ImmutableExt;
import java.util.Collections;
import java.util.List;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = BookTransaction.class)
@JsonSerialize(as = BookTransaction.class)
public abstract class AbstractBookTransaction implements Auditable {
  abstract TransactionId id();

  abstract TransactionId externalId();

  abstract BookTransactionType transactionType();

  @Value.Default
  List<TransactionItem> items() {
    return Collections.emptyList();
  }

  @Value.Default
  List<TransactionStatus> status() {
    return Collections.emptyList();
  }
}
