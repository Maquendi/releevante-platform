package com.main.adapter.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.application.dto.*;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.identity.application.dto.SmartLibraryGrantedAccessDto;
import com.releevante.types.ImmutableExt;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LibrarySyncResponseDto.class)
@JsonSerialize(as = LibrarySyncResponseDto.class)
@ImmutableExt
public abstract class AbstractLibrarySyncResponseDto {
  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<ClientSyncResponse> clients() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<SmartLibraryGrantedAccessDto> accesses() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<BookCopyDto> books() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<BookImageDto> bookImages() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<LibrarySettingsDto> settings() {
    return Collections.emptyList();
  }

  public static LibrarySyncResponseDto fromImages(List<BookImageDto> images) {
    return LibrarySyncResponseDto.builder().bookImages(images).build();
  }

  public static LibrarySyncResponseDto fromAccess(
      List<SmartLibraryGrantedAccessDto> libraryAccessDto) {
    return LibrarySyncResponseDto.builder().accesses(libraryAccessDto).build();
  }

  public static LibrarySyncResponseDto fromBooks(List<BookCopyDto> books) {
    return LibrarySyncResponseDto.builder().books(books).build();
  }

  public static LibrarySyncResponseDto fromEmpty() {
    return LibrarySyncResponseDto.builder().build();
  }

  public static LibrarySyncResponseDto fromSettings(List<LibrarySettingsDto> settings) {
    return LibrarySyncResponseDto.builder().settings(settings).build();
  }

  public static LibrarySyncResponseDto from(List<ClientSyncResponse> clients) {
    return LibrarySyncResponseDto.builder().clients(clients).build();
  }

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
