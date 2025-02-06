package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.BookReservationItem;
import com.releevante.core.domain.Isbn;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_reservation_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookReservationItemsRecord extends PersistableEntity {
  @Id private String id;
  private Integer qty;
  private String isbn;
  private String reservationId;

  private static BookReservationItemsRecord fromDomain(BookReservationItem item) {
    var record = new BookReservationItemsRecord();
    record.setId(item.id());
    record.setQty(item.qty());
    record.setIsbn(item.isbn().value());
    return record;
  }

  public static Set<BookReservationItemsRecord> fromDomain(
      BookReservationRecord reservationRecord, BookReservation reservation) {
    return reservation.items().stream()
        .map(BookReservationItemsRecord::fromDomain)
        .map(bookReservationItemRecord -> bookReservationItemRecord.with(reservationRecord))
        .collect(Collectors.toSet());
  }

  public static List<BookReservationItem> toDomain(
      Set<BookReservationItemsRecord> reservationItems) {
    return reservationItems.stream()
        .map(BookReservationItemsRecord::toDomain)
        .collect(Collectors.toList());
  }

  public BookReservationItem toDomain() {
    return BookReservationItem.builder().id(getId()).qty(getQty()).isbn(Isbn.of(isbn)).build();
  }

  public BookReservationItemsRecord with(BookReservationRecord reservation) {
    this.setReservationId(reservation.getId());
    return this;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookReservationItemsRecord that = (BookReservationItemsRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
