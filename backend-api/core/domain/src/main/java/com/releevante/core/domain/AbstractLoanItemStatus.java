package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableObject;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoanItemStatus.class)
@JsonSerialize(as = LoanItemStatus.class)
@ImmutableObject
public abstract class AbstractLoanItemStatus {

  abstract String id();

  abstract String itemId();

  abstract LoanItemStatuses statuses();

  abstract ZonedDateTime createdAt();
}
