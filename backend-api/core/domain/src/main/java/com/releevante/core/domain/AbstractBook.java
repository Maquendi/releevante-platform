package com.releevante.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Book.class)
@JsonSerialize(as = Book.class)
@ImmutableExt
public abstract class AbstractBook {
  abstract Isbn isbn();

  abstract String correlationId();

  abstract String title();

  abstract BigDecimal price();

  abstract int qty();

  abstract String description();

  abstract String descriptionFr();

  abstract String descriptionSp();

  abstract String author();

  abstract String language();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract Integer printLength();

  abstract LocalDate publishDate();

  abstract String dimensions();

  abstract String publisher();

  abstract Optional<String> publicIsbn();

  abstract Optional<String> bindingType();

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<Tag> keyWords() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<Tag> categories() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<Tag> subCategories() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<BookRating> ratings() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<BookImage> images() {
    return Collections.emptyList();
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<BookCpy> copies() {
    return Collections.emptyList();
  }

  @JsonIgnore
  public List<String> joinTags() {
    var categories = new ArrayList<>(categories());
    categories.addAll(subCategories());
    return categories.stream().map(Tag::value).collect(Collectors.toList());
  }
}
