package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.BookCopy;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = BookCopyDto.class)
@JsonSerialize(as = BookCopyDto.class)
public abstract class AbstractBookCopyDto {
  abstract String id();

  abstract String isbn();

  abstract String title();

  abstract String author();

  abstract String language();

  abstract BigDecimal price();

  abstract String correlationId();

  abstract String description();

  abstract String descriptionFr();

  abstract String descriptionSp();

  @Value.Default
  List<BookImageDto> images() {
    return Collections.emptyList();
  }

  public static BookCopyDto from(BookCopy copy) {
    return BookCopyDto.builder()
        .id(copy.id())
        .isbn(copy.isbn().value())
        .correlationId(copy.correlationId())
        .description(copy.description())
        .title(copy.title())
        .price(copy.price())
        .author(copy.author())
        .language(copy.language())
        .descriptionFr(copy.descriptionFr())
        .descriptionSp(copy.descriptionSp())
        .build();
  }
}
