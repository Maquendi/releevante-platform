package com.releevante.identity.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = PinUserAccessDto.class)
@JsonSerialize(as = PinUserAccessDto.class)
@ImmutableExt
public abstract class AbstractPinUserAccessDto {
  abstract String accessCode();

  abstract Optional<String> room();

  abstract Optional<ZonedDateTime> expiresAt();

  abstract Optional<Integer> accessDueDays();

  abstract List<String> sLids();
}
