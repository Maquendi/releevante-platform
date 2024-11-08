package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.BookCopyId;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = CartItem.class)
@JsonSerialize(as = CartItem.class)
@ImmutableExt
public abstract class AbstractCartItem {
  abstract String id();

  abstract Optional<BookCopyId> bookCopyId();

  abstract LazyLoader<BookEdition> book();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updated();

  abstract Integer qty();

  abstract BigDecimal itemPrice();
}
