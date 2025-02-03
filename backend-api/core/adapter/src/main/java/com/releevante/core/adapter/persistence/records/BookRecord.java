package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Book;
import com.releevante.core.domain.Isbn;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Optional;
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

  @Transient private Set<BookRatingRecord> ratings = new LinkedHashSet<>();

  public static BookRecord fromDomain(Book book) {
    var record = new BookRecord();
    record.setId(book.isbn().value());
    record.setTitle(book.title());
    record.setPrice(book.price());
    record.setQty(book.qty());
    record.setDescription(book.description());
    record.setDescriptionFr(book.descriptionFr());
    record.setDescriptionEs(book.descriptionSp());
    record.setCreatedAt(book.createdAt());
    record.setUpdatedAt(book.updatedAt());
    record.setAuthor(book.author());
    record.setCorrelationId(book.correlationId());
    record.setLang(book.language());
    record.setPrintLength(book.printLength());
    record.setDimensions(book.dimensions());
    record.setPublisher(book.publisher());
    record.setPublishDate(book.publishDate());
    record.setPublicIsbn(book.publicIsbn().orElse(null));
    record.setBindingType(book.bindingType().orElse(null));
    record.setRating(book.rating());
    record.setVotes(book.votes());
    record.setQtyForSale(book.qtyForSale());
    record.setTranslationId(book.translationId());
    return record;
  }

  public Book toDomain() {
    return Book.builder()
        .isbn(Isbn.of(getId()))
        .ratings(BookRatingRecord.toDomain(getRatings()))
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
