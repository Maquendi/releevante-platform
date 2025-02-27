package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.BookReservationItem;
import com.releevante.core.domain.BookTransactionType;
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
public class BookReservationItemsRecord extends PersistableRecord {
  @Id private String id;
  private Integer qty;
  private String isbn;
  private String reservationId;
  BookTransactionType transactionType;

  private static BookReservationItemsRecord fromDomain(BookReservationItem item) {
    var record = new BookReservationItemsRecord();
    record.setId(item.id());
    record.setQty(item.qty());
    record.setIsbn(item.isbn().value());
    record.setTransactionType(item.transactionType());
    return record;
  }

  public static Set<BookReservationItemsRecord> fromDomain(
      BookReservationRecord reservationRecord, BookReservation reservation) {
    return reservation.items().stream()
        .map(BookReservationItemsRecord::fromDomain)
        .map(bookReservationItemRecord -> bookReservationItemRecord.with(reservationRecord))
        .collect(Collectors.toSet());
  }

  public static List<BookReservationItemsRecord> fromDomain(
      String reservationRecordId, List<BookReservationItem> reservationItems) {
    return reservationItems.stream()
        .map(item -> fromDomain(item).with(reservationRecordId))
        .toList();
  }

  public static List<BookReservationItem> toDomain(
      Set<BookReservationItemsRecord> reservationItems) {
    return reservationItems.stream()
        .map(BookReservationItemsRecord::toDomain)
        .collect(Collectors.toList());
  }

  public BookReservationItem toDomain() {
    return BookReservationItem.builder()
        .id(getId())
        .qty(getQty())
        .isbn(Isbn.of(isbn))
        .transactionType(transactionType)
        .build();
  }

  public BookReservationItemsRecord with(BookReservationRecord reservation) {
    this.with(reservation.getId());
    return this;
  }

  public BookReservationItemsRecord with(String reservationId) {
    this.setReservationId(reservationId);
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
