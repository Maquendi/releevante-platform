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
public class BookRatingRecord extends PersistableEntity {

  @Id private String id;

  private String clientId;

  private String isbn;

  private int rating;

  private String orgId;

  private boolean isSynced;

  private static BookRatingRecord fromDomain(ClientRecord client, BookRating rating) {
    return fromDomain(client.getId(), rating);
  }

  private static BookRatingRecord fromDomain(String clientId, BookRating rating) {
    var record = new BookRatingRecord();
    record.setId(rating.id());
    record.setRating(rating.rating());
    record.setIsbn(rating.isbn());
    record.setClientId(clientId);
    return record;
  }

  protected static Set<BookRatingRecord> fromDomain(ClientRecord client, List<BookRating> ratings) {
    return ratings.stream().map(rating -> fromDomain(client, rating)).collect(Collectors.toSet());
  }

  public BookRating toDomain() {
    return BookRating.builder()
        .id(id)
        .rating(rating)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
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
    return client.bookRatings().stream()
        .map(rating -> fromDomain(client.id().value(), rating))
        .toList();
  }
}
