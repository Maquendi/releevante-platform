package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.TransactionId;
import com.releevante.core.domain.TransactionStatus;
import com.releevante.core.domain.TransactionStatusEnum;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionStatusDto.class)
@JsonSerialize(as = TransactionStatusDto.class)
public abstract class AbstractTransactionStatusDto {
  abstract String id();

  abstract Optional<String> transactionId();

  abstract TransactionStatusEnum status();

  abstract ZonedDateTime createdAt();

  public TransactionStatus toDomain(AccountPrincipal principal, TransactionId transactionId) {
    return TransactionStatus.builder()
        .id(id())
        .transactionId(transactionId)
        .status(status())
        .createdAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }

  public TransactionStatus toDomain(AccountPrincipal principal) {
    return TransactionStatus.builder()
        .id(id())
        .transactionId(
            transactionId()
                .map(TransactionId::of)
                .orElseThrow(() -> new RuntimeException("transaction id is required")))
        .status(status())
        .createdAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }
}
