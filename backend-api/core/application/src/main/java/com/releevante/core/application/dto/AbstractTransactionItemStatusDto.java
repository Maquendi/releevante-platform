package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.TransactionItemStatus;
import com.releevante.core.domain.TransactionItemStatusEnum;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionItemStatusDto.class)
@JsonSerialize(as = TransactionItemStatusDto.class)
public abstract class AbstractTransactionItemStatusDto {
  abstract String id();

  abstract Optional<String> itemId();

  abstract TransactionItemStatusEnum status();

  abstract ZonedDateTime createdAt();

  public TransactionItemStatus toDomain(
      AccountPrincipal principal, String itemId, SequentialGenerator<String> uuidGenerator) {
    return TransactionItemStatus.builder()
        .id(uuidGenerator.next())
        .externalId(id())
        .itemId(itemId)
        .status(status())
        .createdAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }

  public TransactionItemStatus toDomain(
      AccountPrincipal principal, SequentialGenerator<String> uuidGenerator) {
    return TransactionItemStatus.builder()
        .id(uuidGenerator.next())
        .externalId(id())
        .itemId(itemId().orElseThrow(() -> new RuntimeException("item is is required")))
        .status(status())
        .createdAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }
}
