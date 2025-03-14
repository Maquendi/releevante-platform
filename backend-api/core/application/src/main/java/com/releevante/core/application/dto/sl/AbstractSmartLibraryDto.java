package com.releevante.core.application.dto.sl;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.core.domain.types.SmartLibraryState;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibraryDto.class)
@JsonSerialize(as = SmartLibraryDto.class)
@ImmutableExt
public abstract class AbstractSmartLibraryDto {
  abstract String slid();

  abstract String org();

  abstract SmartLibraryState status();

  public static SmartLibraryDto from(SmartLibrary smartLibrary) {
    return SmartLibraryDto.builder()
        .slid(smartLibrary.id().value())
        .org(smartLibrary.orgId())
        .status(smartLibrary.currentStatus())
        .build();
  }
}
