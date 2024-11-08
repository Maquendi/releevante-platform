package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.BookReservationItem;
import jakarta.persistence.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_reservation_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookReservationItemRecord {
  @Id private String id;
  private Integer qty;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "isbn")
  @Column(name = "isbn")
  private BookRecord book;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private BookReservationRecord reservation;

  public static BookReservationItemRecord fromDomain(BookReservationItem item) {
    var record = new BookReservationItemRecord();
    record.setId(item.id());
    record.setQty(item.qty());
    record.setBook(BookRecord.fromDomain(item.book()));
    return record;
  }

  public static Set<BookReservationItemRecord> fromDomain(
      BookReservationRecord reservationRecord, BookReservation reservation) {
    return reservation.items().get().stream()
        .map(BookReservationItemRecord::fromDomain)
        .map(bookReservationItemRecord -> bookReservationItemRecord.with(reservationRecord))
        .collect(Collectors.toSet());
  }

  public static List<BookReservationItem> toDomain(
      Set<BookReservationItemRecord> reservationItems) {
    return reservationItems.stream()
        .map(BookReservationItemRecord::toDomain)
        .collect(Collectors.toList());
  }

  public BookReservationItem toDomain() {
    return BookReservationItem.builder()
        .id(getId())
        .qty(getQty())
        .book(getBook().toDomain())
        .build();
  }

  public BookReservationItemRecord with(BookReservationRecord reservation) {
    this.setReservation(reservation);
    return this;
  }
}
