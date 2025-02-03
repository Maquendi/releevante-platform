package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = PartialBook.class)
@JsonSerialize(as = PartialBook.class)
@ImmutableExt
public abstract class AbstractPartialBook {
  abstract Isbn isbn();

  abstract String translationId();

  abstract String title();

  abstract String author();

  abstract String image();

  abstract int votes();

  abstract float rating();

  public static PartialBook from(Book book) {
    return PartialBook.builder()
        .isbn(book.isbn())
        .author(book.author())
        .image(book.image().orElseThrow())
        .rating(book.rating())
        .title(book.title())
        .translationId(book.translationId())
        .votes(book.votes())
        .build();
  }
}
