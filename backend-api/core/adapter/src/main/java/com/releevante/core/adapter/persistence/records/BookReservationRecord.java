package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.LazyLoaderInit;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_reservations", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookReservationRecord extends PersistableEntity {
  @Id private String id;

  private String clientId;

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;

  @Transient private Set<BookReservationItemsRecord> reservationItems = new HashSet<>();

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
    record.setClientId(client.getId());
    return record;
  }

  public BookReservation toDomain() {
    return BookReservation.builder()
        .id(id)
        .clientId(ClientId.of(getClientId()))
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
