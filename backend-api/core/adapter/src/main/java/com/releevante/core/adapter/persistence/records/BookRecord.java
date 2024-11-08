package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookEdition;
import com.releevante.core.domain.Isbn;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
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

  public static BookRecord fromDomain(BookEdition bookEdition) {
    var record = new BookRecord();
    record.setIsbn(bookEdition.isbn().value());
    record.setTitle(bookEdition.title());
    record.setPrice(bookEdition.price());
    return record;
  }

  public BookEdition toDomain() {
    return BookEdition.builder().isbn(Isbn.of(isbn)).price(price).title(title).build();
  }
}
