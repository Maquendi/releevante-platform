package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookRating;
import com.releevante.core.domain.Client;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_ratings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookRatingRecord extends AuditableEntity {
  @Id private String id;
  private String isbn;
  private int rating;
  private boolean isSynced;

  public static BookRatingRecord fromDomain(BookRating rating) {
    var record = new BookRatingRecord();
    record.setId(rating.id());
    record.setRating(rating.rating());
    record.setIsbn(rating.isbn());
    record.setOrigin(rating.origin());
    record.setSynced(false);
    record.setAudit(rating.audit());
    record.setOrigin(rating.origin());
    record.setCreatedAt(rating.createdAt());
    return record;
  }

  protected static Set<BookRatingRecord> fromDomain(List<BookRating> ratings) {
    return ratings.stream().map(BookRatingRecord::fromDomain).collect(Collectors.toSet());
  }

  public BookRating toDomain() {
    return BookRating.builder()
        .id(id)
        .rating(rating)
        .isbn(isbn)
        .createdAt(createdAt)
        .audit(audit)
        .origin(origin)
        .build();
  }

  public static List<BookRating> toDomain(Set<BookRatingRecord> records) {
    return records.stream().map(BookRatingRecord::toDomain).collect(Collectors.toList());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookRatingRecord that = (BookRatingRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  public static List<BookRatingRecord> fromDomain(Client client) {
    return client.bookRatings().stream().map(BookRatingRecord::fromDomain).toList();
  }
}
