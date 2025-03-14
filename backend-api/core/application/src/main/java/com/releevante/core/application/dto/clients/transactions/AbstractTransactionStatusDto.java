package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.TransactionId;
import com.releevante.core.domain.TransactionStatus;
import com.releevante.core.domain.TransactionStatusEnum;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionStatusDto.class)
@JsonSerialize(as = TransactionStatusDto.class)
public abstract class AbstractTransactionStatusDto {
  abstract String id();

  abstract String transactionId();

  abstract TransactionStatusEnum status();

  abstract ZonedDateTime createdAt();

  public TransactionStatus toDomain(
      AccountPrincipal principal,
      TransactionId transactionId,
      SequentialGenerator<String> uuidGenerator) {
    return TransactionStatus.builder()
        .id(uuidGenerator.next())
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
        .transactionId(TransactionId.of(transactionId()))
        .status(status())
        .createdAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }
}
