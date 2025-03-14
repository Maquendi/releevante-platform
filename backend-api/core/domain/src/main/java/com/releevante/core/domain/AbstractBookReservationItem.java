package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookReservationItem.class)
@JsonSerialize(as = BookReservationItem.class)
@ImmutableExt
public abstract class AbstractBookReservationItem {
  abstract String id();

  abstract Integer qty();

  abstract Isbn isbn();

  abstract BookTransactionType transactionType();

  @Value.Check
  protected void check() {
    if (qty() < 1) {
      throw new IllegalArgumentException("Quantity must be greater than 0");
    }
  }

  private boolean isEquals(BookReservationItem obj) {
    return id().equals(obj.id()) && transactionType() == obj.transactionType();
  }

  public boolean isRent() {
    return transactionType() == BookTransactionType.RENT;
  }

  @Override
  public boolean equals(Object obj) {
    return obj instanceof BookReservationItem && isEquals((BookReservationItem) obj);
  }
}
