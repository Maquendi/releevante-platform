package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
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

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract List<CartSyncDto> carts();

  abstract List<BookLoanDto> loans();

  public Client toDomain(Slid slid) {
    return Client.builder()
        .id(ClientId.of(id()))
        .createdAt(createdAt())
        .updatedAt(updatedAt())
        .carts(carts().stream().map(CartSyncDto::toDomain).collect(Collectors.toList()))
        .loans(loans().stream().map(loan -> loan.toDomain(slid)).collect(Collectors.toList()))
        .purchases(Collections.emptyList())
        .reservations(Collections.emptyList())
        .bookRatings(Collections.emptyList())
        .build();
  }
}
