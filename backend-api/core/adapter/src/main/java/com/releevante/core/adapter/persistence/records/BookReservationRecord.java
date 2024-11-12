package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.LazyLoaderInit;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_reservations", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookReservationRecord {
  @Id private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "client_id")
  private ClientRecord client;

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "reservation", cascade = CascadeType.PERSIST)
  private Set<BookReservationItemsRecord> reservationItems = new HashSet<>();

  protected static Set<BookReservationRecord> fromDomain(
      ClientRecord client, List<BookReservation> reservations) {
    return reservations.stream()
        .map(reservation -> fromDomain(client, reservation))
        .collect(Collectors.toSet());
  }

  private static BookReservationRecord fromDomain(
      ClientRecord client, BookReservation reservation) {
    var record = new BookReservationRecord();
    record.setId(reservation.id());
    record.setStartTime(reservation.startTime());
    record.setEndTime(reservation.endTime());
    record.setCreatedAt(reservation.createdAt());
    record.setUpdatedAt(reservation.updateAt());
    record.setReservationItems(BookReservationItemsRecord.fromDomain(record, reservation));
    record.setClient(client);
    return record;
  }

  public BookReservation toDomain() {
    return BookReservation.builder()
        .id(id)
        .clientId(ClientId.of(getClient().getId()))
        .startTime(startTime)
        .endTime(endTime)
        .createdAt(createdAt)
        .updateAt(updatedAt)
        .items(
            new LazyLoaderInit<>(() -> BookReservationItemsRecord.toDomain(getReservationItems())))
        .build();
  }

  public static List<BookReservation> toDomain(Set<BookReservationRecord> records) {
    return records.stream().map(BookReservationRecord::toDomain).collect(Collectors.toList());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookReservationRecord that = (BookReservationRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
