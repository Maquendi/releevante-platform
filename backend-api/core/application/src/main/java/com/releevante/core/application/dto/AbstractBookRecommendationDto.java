package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.PartialBook;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookRecommendationDto.class)
@JsonSerialize(as = BookRecommendationDto.class)
@ImmutableExt
public abstract class AbstractBookRecommendationDto {
  abstract List<Book> recommended();

  abstract List<PartialBook> others();
}
