package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Client.class)
@JsonSerialize(as = Client.class)
@ImmutableExt
public abstract class AbstractClient {
  abstract ClientId id();

  abstract LazyLoader<List<Cart>> carts();

  abstract LazyLoader<List<BookSale>> purchases();

  abstract LazyLoader<List<BookLoan>> loans();

  abstract LazyLoader<List<BookReservation>> reservations();
}
