package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookReservation;
import com.releevante.core.domain.ClientId;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
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
  @JoinColumn(name = "id")
  private ClientRecord client;

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "reservation", cascade = CascadeType.PERSIST)
  private Set<BookReservationItemRecord> reservationItems = new HashSet<>();

  public static BookReservationRecord fromDomain(BookReservation reservation) {
    var record = new BookReservationRecord();

    // todo: ojo con eso.
    record.setId(reservation.id());
    var clientRecord = new ClientRecord();
    clientRecord.setId(reservation.clientId().value());
    record.setClient(clientRecord);
    record.setStartTime(reservation.startTime());
    record.setEndTime(reservation.endTime());
    record.setCreatedAt(reservation.createdAt());
    record.setUpdatedAt(reservation.updateAt());
    record.setReservationItems(BookReservationItemRecord.fromDomain(record, reservation));
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
        .items(() -> BookReservationItemRecord.toDomain(getReservationItems()))
        .build();
  }
}
