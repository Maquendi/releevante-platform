package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.LazyLoaderInit;
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

  @OneToOne(fetch = FetchType.LAZY)
  ServiceRatingRecord serviceRating;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client", cascade = CascadeType.PERSIST)
  Set<BookLoanRecord> bookLoans = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
  @OrderBy("createdAt DESC")
  Set<BookReservationRecord> reservations = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
  @OrderBy("createdAt DESC")
  Set<BookRatingRecord> bookRatings = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
  @OrderBy("createdAt DESC")
  Set<BookSaleRecord> purchases = new LinkedHashSet<>();

  protected static ClientRecord fromDomain(Client client) {
    var record = new ClientRecord();
    record.setId(client.id().value());
    record.setCreatedAt(client.createdAt());
    record.setUpdatedAt(client.updatedAt());
    return record;
  }

  public static ClientRecord serviceRating(Client client) {
    var clientRecord = fromDomain(client);
    var rating = ServiceRatingRecord.fromDomain(client);
    rating.setClient(clientRecord);
    clientRecord.setServiceRating(rating);
    return clientRecord;
  }

  public static ClientRecord bookLoans(Client client) {
    var clientRecord = fromDomain(client);
    client.loans().get().stream()
        .map(BookLoanRecord::fromDomain)
        .forEach(
            bookLoan -> {
              bookLoan.setClient(clientRecord);
              clientRecord.getBookLoans().add(bookLoan);
            });
    return clientRecord;
  }

  public static ClientRecord bookReservations(Client client) {
    var clientRecord = fromDomain(client);
    client.reservations().get().stream()
        .map(BookReservationRecord::fromDomain)
        .forEach(
            reservation -> {
              reservation.setClient(clientRecord);
              clientRecord.getReservations().add(reservation);
            });
    return clientRecord;
  }

  public static ClientRecord bookRatings(Client client) {
    var clientRecord = fromDomain(client);
    client.bookRatings().get().stream()
        .map(BookRatingRecord::fromDomain)
        .forEach(
            rating -> {
              rating.setClient(clientRecord);
              clientRecord.getBookRatings().add(rating);
            });
    return clientRecord;
  }

  public static ClientRecord bookPurchases(Client client) {
    var clientRecord = fromDomain(client);
    client.purchases().get().stream()
        .map(BookSaleRecord::fromDomain)
        .forEach(
            saleRecord -> {
              saleRecord.setClient(clientRecord);
              clientRecord.getPurchases().add(saleRecord);
            });
    return clientRecord;
  }

  public Client toDomain() {
    return Client.builder()
        .id(ClientId.of(id))
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .loans(new LazyLoaderInit<>(() -> BookLoanRecord.toDomain(getBookLoans())))
        .reservations(new LazyLoaderInit<>(() -> BookReservationRecord.toDomain(getReservations())))
        .bookRatings(new LazyLoaderInit<>(() -> BookRatingRecord.toDomain(getBookRatings())))
        .purchases(new LazyLoaderInit<>(() -> BookSaleRecord.toDomain(getPurchases())))
        .serviceRating(new LazyLoaderInit<>(() -> getServiceRating().toDomain()))
        .build();
  }
}
