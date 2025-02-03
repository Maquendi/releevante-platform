package com.releevante.core.adapter.persistence.dao.projections;

import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookCategoryProjection {
  private String tagId;
  private String isbn;
  private String name;
  private String valueEn;
  private String valueFr;
  private String valueSp;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookCategoryProjection that = (BookCategoryProjection) o;
    return Objects.equals(tagId, that.tagId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(tagId);
  }
}
