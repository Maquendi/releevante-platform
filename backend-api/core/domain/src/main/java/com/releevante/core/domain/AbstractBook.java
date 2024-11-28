package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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

  abstract String descriptionEnglish();

  abstract String descriptionFrench();

  abstract String descriptionSpanish();

  abstract String author();

  abstract String language();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  @Value.Default
  List<String> keyWords() {
    return Collections.emptyList();
  }

  @Value.Default
  List<String> categories() {
    return Collections.emptyList();
  }

  @Value.Default
  List<String> subCategories() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookRating> ratings() {
    return Collections.emptyList();
  }

  @Value.Default
  List<BookImage> images() {
    return Collections.emptyList();
  }

  public List<String> categoriesCombined() {
    var categories = new ArrayList<>(categories());
    categories.addAll(subCategories());
    return categories;
  }
}
