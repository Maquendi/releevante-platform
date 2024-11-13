package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Book;
import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.LazyLoaderInit;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "books", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookRecord {
  @Id private String isbn;
  private String title;
  private BigDecimal price;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @Transient private Set<BookRatingRecord> ratings = new LinkedHashSet<>();

  public static BookRecord fromDomain(Book book) {
    var record = new BookRecord();
    record.setIsbn(book.isbn().value());
    record.setTitle(book.title());
    record.setPrice(book.price());
    return record;
  }

  public static BookRecord from(Isbn isbn) {
    var record = new BookRecord();
    record.setIsbn(isbn.value());
    return record;
  }

  public Book toDomain() {
    return Book.builder()
        .isbn(Isbn.of(isbn))
        .ratings(new LazyLoaderInit<>(() -> BookRatingRecord.toDomain(getRatings())))
        .price(price)
        .title(title)
        .build();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookRecord that = (BookRecord) o;
    return Objects.equals(isbn, that.isbn);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
