package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.LazyLoaderInit;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ClientSyncDto.class)
@JsonSerialize(as = ClientSyncDto.class)
@ImmutableExt
public abstract class AbstractClientSyncDto {

  abstract String id();

  abstract List<CartSyncDto> carts();

  abstract List<BookLoanDto> loans();

  public Client toDomain(Slid slid) {
    return Client.builder()
        .id(ClientId.of(id()))
        .carts(
            new LazyLoaderInit<>(
                () ->
                    carts().stream()
                        .map(AbstractCartSyncDto::toDomain)
                        .collect(Collectors.toList())))
        .loans(
            new LazyLoaderInit<>(
                () ->
                    loans().stream().map(loan -> loan.toDomain(slid)).collect(Collectors.toList())))
        .serviceRating(new LazyLoaderInit<>(() -> null))
        .purchases(new LazyLoaderInit<>(Collections::emptyList))
        .reservations(new LazyLoaderInit<>(Collections::emptyList))
        .bookRatings(new LazyLoaderInit<>(Collections::emptyList))
        .build();
  }
}
