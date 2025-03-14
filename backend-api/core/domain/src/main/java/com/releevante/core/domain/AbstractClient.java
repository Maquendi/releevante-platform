package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Client.class)
@JsonSerialize(as = Client.class)
@ImmutableExt
public abstract class AbstractClient {
  abstract ClientId id();

  @Value.Default
  ZonedDateTime createdAt() {
    return ZonedDateTime.now();
  }

  @Value.Default
  ZonedDateTime updatedAt() {
    return ZonedDateTime.now();
  }

  @Value.Default
  List<BookReservation> reservations() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookRating> bookRatings() {
    return Collections.emptyList();
  }

  abstract Optional<ServiceRating> serviceRating();

  @Value.Default
  List<Cart> carts() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookTransaction> transactions() {
    return Collections.emptyList();
  }

  @Value.Default
  List<TransactionItemStatus> transactionItemStatus() {
    return Collections.emptyList();
  }

  @Value.Default
  List<TransactionStatus> transactionStatus() {
    return Collections.emptyList();
  }
}
