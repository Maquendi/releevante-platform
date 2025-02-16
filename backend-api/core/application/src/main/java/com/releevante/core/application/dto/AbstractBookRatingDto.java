package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookRating;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = BookRatingDto.class)
@JsonSerialize(as = BookRatingDto.class)
public abstract class AbstractBookRatingDto {
  abstract String isbn();

  abstract int rating();

  abstract ZonedDateTime createdAt();

  public BookRating toDomain(
      AccountPrincipal principal, SequentialGenerator<String> uuidGenerator) {
    return BookRating.builder()
        .id(uuidGenerator.next())
        .rating(rating())
        .isbn(isbn())
        .createdAt(createdAt())
        .updatedAt(createdAt())
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }
}
