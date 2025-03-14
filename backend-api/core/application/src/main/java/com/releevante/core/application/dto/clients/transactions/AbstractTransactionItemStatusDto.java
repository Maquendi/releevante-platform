package com.releevante.core.application.dto.clients.transactions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.TransactionItemStatus;
import com.releevante.core.domain.TransactionItemStatusEnum;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionItemStatusDto.class)
@JsonSerialize(as = TransactionItemStatusDto.class)
public abstract class AbstractTransactionItemStatusDto {
  abstract String id();

  abstract String itemId();

  abstract TransactionItemStatusEnum status();

  abstract ZonedDateTime createdAt();

  public TransactionItemStatus toDomain(
      AccountPrincipal principal, String itemId, SequentialGenerator<String> uuidGenerator) {
    return TransactionItemStatus.builder()
        .id(uuidGenerator.next())
        .itemId(itemId)
        .status(status())
        .createdAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }

  public TransactionItemStatus toDomain(AccountPrincipal principal) {
    return TransactionItemStatus.builder()
        .id(id())
        .itemId(itemId())
        .status(status())
        .createdAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }
}
