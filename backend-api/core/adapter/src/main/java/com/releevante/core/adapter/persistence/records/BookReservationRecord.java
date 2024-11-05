package com.releevante.core.adapter.persistence.records;

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
  @Id
  private String id;
  private String clientId;
  private ZonedDateTime startTime;
  private ZonedDateTime endTime;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "reservation")
  private Set<BookReservationDetailRecord> reservationDetails = new HashSet<>();
}
