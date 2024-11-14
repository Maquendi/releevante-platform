package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ClientSyncDto.class)
@JsonSerialize(as = ClientSyncDto.class)
@ImmutableExt
public abstract class AbstractClientSyncDto {

  abstract Optional<String> id();

  abstract String externalId();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract List<BookLoanDto> loans();

  public Client toDomain(Slid slid) {
    var clientId = ClientId.of(id().orElse(UuidGenerator.instance().next()));
    var externalId = ClientId.of(externalId());
    return Client.builder()
        .id(clientId)
        .externalId(externalId)
        .isNew(id().isEmpty())
        .createdAt(createdAt())
        .updatedAt(updatedAt())
        .loans(loans().stream().map(loan -> loan.toDomain(slid)).collect(Collectors.toList()))
        .build();
  }
}
