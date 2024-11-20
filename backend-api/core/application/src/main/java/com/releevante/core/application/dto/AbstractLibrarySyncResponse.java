package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.Collections;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LibrarySyncResponse.class)
@JsonSerialize(as = LibrarySyncResponse.class)
@ImmutableExt
public abstract class AbstractLibrarySyncResponse {
  @Value.Default
  List<ClientSyncResponse> clients() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookCopyDto> books() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookImageDto> bookImages() {
    return Collections.emptyList();
  }

  @Value.Default
  List<LibrarySettingsDto> settings() {
    return Collections.emptyList();
  }

  public static LibrarySyncResponse fromImages(List<BookImageDto> images) {
    return LibrarySyncResponse.builder().bookImages(images).build();
  }

  public static LibrarySyncResponse from(List<BookCopyDto> books, List<BookImageDto> images) {
    return LibrarySyncResponse.builder().books(books).bookImages(images).build();
  }

  public static LibrarySyncResponse fromEmpty() {
    return LibrarySyncResponse.builder().build();
  }

  public static LibrarySyncResponse fromSettings(List<LibrarySettingsDto> settings) {
    return LibrarySyncResponse.builder().settings(settings).build();
  }

  public static LibrarySyncResponse from(List<ClientSyncResponse> clients) {
    return LibrarySyncResponse.builder().clients(clients).build();
  }
}
