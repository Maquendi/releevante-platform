package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.Auditable;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionStatus.class)
@JsonSerialize(as = TransactionStatus.class)
public abstract class AbstractTransactionStatus implements Auditable {
  abstract String id();

  abstract TransactionId transactionId();

  abstract TransactionStatusEnum status();
}
