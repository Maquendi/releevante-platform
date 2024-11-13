package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Client.class)
@JsonSerialize(as = Client.class)
@ImmutableExt
public abstract class AbstractClient {
  abstract ClientId id();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract List<BookSale> purchases();

  abstract List<BookLoan> loans();

  abstract List<BookReservation> reservations();

  abstract List<BookRating> bookRatings();

  abstract Optional<ServiceRating> serviceRating();

  abstract List<Cart> carts();
}
