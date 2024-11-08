package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import jakarta.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "clients", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class ClientRecord {
  @Id String id;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client", cascade = CascadeType.PERSIST)
  @OrderBy("createdAt DESC")
  Set<BookLoanRecord> bookLoans = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
  @OrderBy("createdAt DESC")
  Set<BookReservationRecord> reservations = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
  @OrderBy("createdAt DESC")
  Set<BookRatingRecord> bookRatings = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
  @OrderBy("createdAt DESC")
  Set<ServiceRatingRecord> serviceRatings = new LinkedHashSet<>();

  public static ClientRecord toDomain(Client client) {
    var record = new ClientRecord();
    record.setId(client.id().value());
    record.setBookLoans(BookLoanRecord.fromDomain(client.loans().get()));

    return record;
  }
}
