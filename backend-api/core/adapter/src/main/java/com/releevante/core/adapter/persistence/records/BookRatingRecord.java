package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookRating;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.List;
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

  public static BookRatingRecord fromDomain(BookRating rating) {
    var record = new BookRatingRecord();
    record.setId(rating.id());
    record.setRating(rating.rating());
    record.setClient(ClientRecord.from(rating.clientId()));
    record.setBook(BookRecord.from(rating.isbn()));
    return record;
  }

  public static Set<BookRatingRecord> fromDomain(List<BookRating> ratings) {
    return ratings.stream().map(BookRatingRecord::fromDomain).collect(Collectors.toSet());
  }
}
