package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Client.class)
@JsonSerialize(as = Client.class)
@ImmutableExt
public abstract class AbstractClient {
  abstract ClientId id();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract LazyLoaderInit<List<BookSale>> purchases();

  abstract LazyLoaderInit<List<BookLoan>> loans();

  abstract LazyLoader<List<BookReservation>> reservations();

  abstract LazyLoaderInit<List<BookRating>> bookRatings();

  abstract LazyLoaderInit<ServiceRating> serviceRating();
}
