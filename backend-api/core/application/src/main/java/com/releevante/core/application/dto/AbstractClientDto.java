package com.releevante.core.application.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.types.*;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = ClientDto.class)
@JsonSerialize(as = ClientDto.class)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractClientDto {
  abstract String id();

  @Value.Default
  List<CreateCartDto> carts() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookReservationDto> reservations() {
    return Collections.emptyList();
  }

  @Value.Default
  List<CreateBookTransactionDto> transactions() {
    return Collections.emptyList();
  }

  @Value.Default
  List<TransactionItemStatusDto> transactionItemStatus() {
    return Collections.emptyList();
  }

  @Value.Default
  List<TransactionStatusDto> transactionStatus() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookRatingDto> bookRatings() {
    return Collections.emptyList();
  }

  public Client toDomain(
      AccountPrincipal principal,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return Client.builder()
        .id(ClientId.of(id()))
        .reservations(
            reservations().stream()
                .map(r -> r.toDomain(uuidGenerator, dateTimeGenerator))
                .collect(Collectors.toList()))
        .transactions(
            transactions().stream()
                .map(t -> t.toDomain(principal, uuidGenerator))
                .collect(Collectors.toList()))
        .transactionStatus(
            transactionStatus().stream()
                .map(status -> status.toDomain(principal, uuidGenerator))
                .collect(Collectors.toList()))
        .transactionItemStatus(
            transactionItemStatus().stream()
                .map(status -> status.toDomain(principal, uuidGenerator))
                .collect(Collectors.toList()))
        .bookRatings(
            bookRatings().stream()
                .map(rating -> rating.toDomain(principal, uuidGenerator, dateTimeGenerator))
                .collect(Collectors.toList()))
        .build();
  }
}
