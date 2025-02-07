package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookTransaction;
import com.releevante.core.domain.BookTransactionType;
import com.releevante.core.domain.TransactionId;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = CreateBookTransactionDto.class)
@JsonSerialize(as = CreateBookTransactionDto.class)
public abstract class AbstractCreateBookTransactionDto {
  abstract String id();

  abstract BookTransactionType transactionType();

  abstract ZonedDateTime createdAt();

  abstract List<TransactionItemDto> items();

  abstract List<TransactionStatusDto> status();

  public BookTransaction toDomain(
      AccountPrincipal principal, SequentialGenerator<String> uuidGenerator) {
    var transactionId = TransactionId.of(uuidGenerator.next());
    return BookTransaction.builder()
        .id(transactionId)
        .externalId(TransactionId.of(id()))
        .transactionType(transactionType())
        .createdAt(createdAt())
        .status(
            status().stream()
                .map(status -> status.toDomain(principal, transactionId))
                .collect(Collectors.toList()))
        .items(items().stream().map(item -> item.toDomain(principal)).collect(Collectors.toList()))
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }
}
