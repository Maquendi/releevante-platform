package com.releevante.core.application.identity.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = SmartLibraryAccessDto.class)
@JsonSerialize(as = SmartLibraryAccessDto.class)
public abstract class AbstractSmartLibraryAccessDto {
  abstract String id();

  abstract String accessId();

  abstract Optional<String> contactless();

  abstract Optional<String> credential();

  abstract boolean isActive();

  abstract ZonedDateTime expiresAt();

  public static SmartLibraryAccessDto from(SmartLibraryAccess access) {
    return SmartLibraryAccessDto.builder()
        .id(access.id())
        .accessId(access.accessId())
        .contactless(access.contactLessId())
        .isActive(access.isActive())
        .expiresAt(access.expiresAt())
        .credential(access.credential())
        .build();
  }
}
