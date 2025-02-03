package com.releevante.core.adapter.persistence.dao.projections;

import com.releevante.core.domain.Book;
import com.releevante.core.domain.Isbn;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookProjection {
  private String isbn;
  private String correlationId;
  private String translationId;
  private String title;
  private int qty;
  private int qtyForSale;
  private BigDecimal price;
  private String author;
  private String description;
  private String descriptionFr;
  private String descriptionEs;
  private String lang;
  private int printLength;
  private String dimensions;
  private String publisher;
  private LocalDate publishDate;
  private String publicIsbn;
  private String bindingType;
  private float rating;
  private int votes;
  private ZonedDateTime updatedAt;
  private ZonedDateTime createdAt;
  private String image;

  public Book toDomain() {
    return Book.builder()
        .isbn(Isbn.of(getIsbn()))
        .updatedAt(updatedAt)
        .createdAt(createdAt)
        .author(author)
        .description(description)
        .descriptionFr(descriptionFr)
        .descriptionSp(descriptionEs)
        .correlationId(correlationId)
        .dimensions(dimensions)
        .printLength(printLength)
        .publisher(publisher)
        .publishDate(publishDate)
        .language(lang)
        .publicIsbn(Optional.ofNullable(publicIsbn))
        .bindingType(Optional.ofNullable(bindingType))
        .votes(votes)
        .rating(rating)
        .qty(qty)
        .price(price)
        .title(title)
        .translationId(translationId)
        .qtyForSale(qtyForSale)
        .image(Optional.ofNullable(image))
        .build();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookProjection that = (BookProjection) o;
    return Objects.equals(isbn, that.isbn);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
