package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookEdition;
import com.releevante.core.domain.Isbn;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
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

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "book", cascade = CascadeType.PERSIST)
  @OrderBy("createdAt DESC")
  private Set<BookRatingRecord> ratings = new LinkedHashSet<>();

  public static BookRecord fromDomain(BookEdition book) {
    var record = new BookRecord();
    record.setIsbn(book.isbn().value());
    record.setTitle(book.title());
    record.setPrice(book.price());
    record.setRatings(BookRatingRecord.fromDomain(book.ratings().get()));
    return record;
  }

  public static BookRecord from(Isbn isbn) {
    var record = new BookRecord();
    record.setIsbn(isbn.value());
    return record;
  }

  public BookEdition toDomain() {
    return BookEdition.builder().isbn(Isbn.of(isbn)).price(price).title(title).build();
  }
}
