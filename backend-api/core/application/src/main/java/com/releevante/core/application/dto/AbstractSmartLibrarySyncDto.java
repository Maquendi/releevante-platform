package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.types.*;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibrarySyncDto.class)
@JsonSerialize(as = SmartLibrarySyncDto.class)
@ImmutableExt
public abstract class AbstractSmartLibrarySyncDto {
  abstract List<ClientDto> clients();

  public List<Client> domainClients(
      AccountPrincipal principal,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return clients().stream()
        .map(client -> client.toDomain(principal, uuidGenerator, dateTimeGenerator))
        .collect(Collectors.toList());
  }
}
