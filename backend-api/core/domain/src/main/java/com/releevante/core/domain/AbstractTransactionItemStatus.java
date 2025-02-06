package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.Auditable;
import com.releevante.types.ImmutableObject;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = TransactionItemStatus.class)
@JsonSerialize(as = TransactionItemStatus.class)
@ImmutableObject
public abstract class AbstractTransactionItemStatus implements Auditable {

  abstract String id();

  abstract String itemId();

  abstract TransactionItemStatusEnum status();

  abstract ZonedDateTime createdAt();
}
