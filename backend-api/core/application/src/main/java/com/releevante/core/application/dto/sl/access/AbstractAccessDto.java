package com.releevante.core.application.dto.sl.access;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = AccessDto.class)
@JsonSerialize(as = AccessDto.class)
public abstract class AbstractAccessDto {

  abstract String accessId();

  abstract Integer accessDueDays();

  abstract ZonedDateTime expiresAt();
}
