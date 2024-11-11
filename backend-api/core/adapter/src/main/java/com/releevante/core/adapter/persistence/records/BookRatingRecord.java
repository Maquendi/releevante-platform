package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookRating;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_ratings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookRatingRecord {
  private String id;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private ClientRecord client;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private BookRecord book;

  private int rating;

  private static BookRatingRecord fromDomain(ClientRecord client, BookRating rating) {
    var record = new BookRatingRecord();
    var book = rating.book().get();
    record.setId(rating.id());
    record.setRating(rating.rating());
    record.setBook(BookRecord.from(book.isbn()));
    record.setClient(client);
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
}
