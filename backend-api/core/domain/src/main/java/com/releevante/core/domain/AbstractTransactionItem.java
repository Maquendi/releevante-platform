package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionItem.class)
@JsonSerialize(as = TransactionItem.class)
public abstract class AbstractTransactionItem {
  abstract String id();

  abstract String cpy();

  abstract List<TransactionItemStatus> status();
}
