package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.ServiceRating;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = ServiceRatingDto.class)
@JsonSerialize(as = ServiceRatingDto.class)
public abstract class AbstractServiceRatingDto {
  abstract int rating();

  abstract Optional<ZonedDateTime> createdAt();

  public ServiceRating toDomain(
      AccountPrincipal principal,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return ServiceRating.builder()
        .id(uuidGenerator.next())
        .rating(rating())
        .createdAt(createdAt().orElse(dateTimeGenerator.next()))
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }
}
