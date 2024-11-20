package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookImage;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookImageDto.class)
@JsonSerialize(as = BookImageDto.class)
@ImmutableExt
public abstract class AbstractBookImageDto {
  abstract String id();

  abstract String isbn();

  abstract String url();

  abstract String sourceUrl();

  public static BookImageDto from(BookImage bookImage) {
    return BookImageDto.builder()
        .id(bookImage.id())
        .isbn(bookImage.isbn())
        .url(bookImage.url())
        .sourceUrl(bookImage.sourceUrl())
        .build();
  }
}
