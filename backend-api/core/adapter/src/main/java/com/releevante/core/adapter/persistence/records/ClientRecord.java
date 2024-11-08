package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
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

  ZonedDateTime createdAt;

  ZonedDateTime updatedAt;

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
    record.setCreatedAt(client.createdAt());
    record.setUpdatedAt(client.updatedAt());

    record.setBookLoans(BookLoanRecord.fromDomain(client.loans().get()));
    record.setReservations(BookReservationRecord.fromDomain(client.reservations().get()));
    record.setBookRatings(BookRatingRecord.fromDomain(client.bookRatings().get()));
    record.setServiceRatings(ServiceRatingRecord.fromDomain(client.serviceRatings().get()));
    return record;
  }

  public static ClientRecord from(ClientId clientId) {
    var record = new ClientRecord();
    record.setId(clientId.value());
    return record;
  }
}
