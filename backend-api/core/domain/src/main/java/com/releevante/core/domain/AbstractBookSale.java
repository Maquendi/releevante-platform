package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookSale.class)
@JsonSerialize(as = BookSale.class)
@ImmutableExt
public abstract class AbstractBookSale {
  abstract SaleId id();

  abstract LazyLoaderInit<Client> client();

  abstract BigDecimal total();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract LazyLoaderInit<Cart> cart();
}
