package com.releevante.core.application.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.TransactionItem;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = TransactionItemDto.class)
@JsonSerialize(as = TransactionItemDto.class)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractTransactionItemDto {

  abstract String id();

  abstract String cpy();

  abstract List<TransactionItemStatusDto> status();

  public TransactionItem toDomain(
      AccountPrincipal principal, SequentialGenerator<String> uuidGenerator) {
    var itemId = uuidGenerator.next();
    return TransactionItem.builder()
        .id(itemId)
        .externalId(id())
        .cpy(cpy())
        .status(
            status().stream()
                .map(s -> s.toDomain(principal, itemId, uuidGenerator))
                .collect(Collectors.toList()))
        .build();
  }
}
