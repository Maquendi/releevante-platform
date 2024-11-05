package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = NfcUserAccessDto.class)
@JsonSerialize(as = NfcUserAccessDto.class)
@ImmutableExt
public abstract class AbstractNfcUserAccessDto {
  abstract String nfcUid();

  abstract Optional<String> room();

  abstract Optional<ZonedDateTime> expiresAt();

  abstract Optional<Integer> accessDueDays();

  abstract List<String> sLids();
}
