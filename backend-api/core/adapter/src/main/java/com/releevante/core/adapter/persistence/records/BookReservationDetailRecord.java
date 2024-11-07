package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookEdition;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_reservation_detail", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookReservationDetailRecord {
  @Id private String id;
  private Integer qty;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "isbn")
  @Column(name = "isbn")
  private BookEdition book;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private BookReservationRecord reservation;
}
