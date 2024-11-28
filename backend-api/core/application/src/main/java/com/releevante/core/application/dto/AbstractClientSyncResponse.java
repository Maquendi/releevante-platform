package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.ImmutableExt;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ClientSyncResponse.class)
@JsonSerialize(as = ClientSyncResponse.class)
@ImmutableExt
public abstract class AbstractClientSyncResponse {
  abstract String clientId();

  abstract String externalId();

  abstract List<LoanSyncResponse> loans();

  public static List<ClientSyncResponse> from(SmartLibrary library) {
    return library.clients().stream()
        .map(
            client -> {
              var syncedLoans =
                  client.loans().stream()
                      .map(
                          loan ->
                              LoanSyncResponse.builder()
                                  .externalId(loan.externalId().value())
                                  .loanId(loan.id().value())
                                  .build())
                      .toList();
              return ClientSyncResponse.builder()
                  .clientId(client.id().value())
                  .externalId(client.externalId().value())
                  .loans(syncedLoans)
                  .build();
            })
        .collect(Collectors.toList());
  }
}
