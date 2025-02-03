package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ClientSyncDto.class)
@JsonSerialize(as = ClientSyncDto.class)
@ImmutableExt
public abstract class AbstractClientSyncDto {
  abstract String id();

  abstract BookLoanSyncDto loan();

  public Client toDomain(AccountPrincipal principal, Slid slid) {
    return Client.builder()
        .id(ClientId.of(id()))
        .loans(List.of(loan().toDomain(principal, slid)))
        .build();
  }
}
