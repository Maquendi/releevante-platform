package com.releevante.core.application.dto.sl;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Client;
import com.releevante.types.*;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibrarySyncDto.class)
@JsonSerialize(as = SmartLibrarySyncDto.class)
@ImmutableExt
public abstract class AbstractSmartLibrarySyncDto {
  public List<Client> toDomain(
      AccountPrincipal principal,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    //    return clients().stream()
    //        .map(client -> client.toDomain(principal, uuidGenerator, dateTimeGenerator))
    //        .collect(Collectors.toList());

    return Collections.emptyList();
  }
}
