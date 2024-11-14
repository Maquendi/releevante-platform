package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibrarySyncDto.class)
@JsonSerialize(as = SmartLibrarySyncDto.class)
@ImmutableExt
public abstract class AbstractSmartLibrarySyncDto {
  abstract String slid();

  abstract List<ClientSyncDto> clients();

  public List<Client> domainClients() {
    var slid = Slid.of(slid());
    return clients().stream().map(client -> client.toDomain(slid)).collect(Collectors.toList());
  }
}
