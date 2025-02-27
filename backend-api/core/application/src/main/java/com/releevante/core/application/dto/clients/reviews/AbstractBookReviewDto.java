package com.releevante.core.application.dto.clients.reviews;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookRating;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@ImmutableExt
@Value.Immutable()
@JsonDeserialize(as = BookReviewDto.class)
@JsonSerialize(as = BookReviewDto.class)
public abstract class AbstractBookReviewDto {
  abstract String isbn();

  abstract int rating();

  abstract Optional<ZonedDateTime> createdAt();

  public BookRating toDomain(
      AccountPrincipal principal,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return BookRating.builder()
        .id(uuidGenerator.next())
        .rating(rating())
        .isbn(isbn())
        .createdAt(createdAt().orElse(dateTimeGenerator.next()))
        .origin(principal.audience())
        .audit(principal.subject())
        .build();
  }

  public Client toClient(
      AccountPrincipal principal,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return Client.builder()
        .id(ClientId.of(principal.subject()))
        .bookRatings(List.of(toDomain(principal, uuidGenerator, dateTimeGenerator)))
        .build();
  }
}
