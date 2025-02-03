package com.releevante.core.adapter.persistence.dao.projections;

import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.PartialBook;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartialBookProjection {
  private String isbn;
  private String translationId;
  private String title;
  private String author;
  private float rating;
  private int votes;
  private String image;

  public PartialBook toDomain() {
    return PartialBook.builder()
        .isbn(Isbn.of(getIsbn()))
        .author(author)
        .votes(votes)
        .rating(rating)
        .title(title)
        .translationId(translationId)
        .image(image)
        .build();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    PartialBookProjection that = (PartialBookProjection) o;
    return Objects.equals(isbn, that.isbn);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
