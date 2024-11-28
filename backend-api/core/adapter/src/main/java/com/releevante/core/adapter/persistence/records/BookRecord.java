package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Book;
import com.releevante.core.domain.Isbn;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "books", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookRecord extends PersistableEntity {
  @Column("isbn")
  @Id
  private String id;

  private String correlationId;
  private String title;
  private int qty;
  private BigDecimal price;
  private String author;
  private String description;
  private String descriptionFr;
  private String descriptionEs;
  private String lang;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @Transient private Set<BookRatingRecord> ratings = new LinkedHashSet<>();

  public static BookRecord fromDomain(Book book) {
    var record = new BookRecord();
    record.setId(book.isbn().value());
    record.setTitle(book.title());
    record.setPrice(book.price());
    record.setQty(book.qty());
    record.setDescription(book.descriptionEnglish());
    record.setDescriptionFr(book.descriptionFrench());
    record.setDescriptionEs(book.descriptionSpanish());
    record.setCreatedAt(book.createdAt());
    record.setUpdatedAt(book.updatedAt());
    record.setAuthor(book.author());
    record.setCorrelationId(book.correlationId());
    record.setLang(book.language());
    return record;
  }

  public Book toDomain() {
    return Book.builder()
        .isbn(Isbn.of(getId()))
        .ratings(BookRatingRecord.toDomain(getRatings()))
        .updatedAt(updatedAt)
        .createdAt(createdAt)
        .author(author)
        .descriptionEnglish(description)
        .descriptionFrench(descriptionFr)
        .descriptionSpanish(descriptionEs)
        .correlationId(correlationId)
        .language(lang)
        .qty(qty)
        .price(price)
        .title(title)
        .build();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookRecord that = (BookRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
