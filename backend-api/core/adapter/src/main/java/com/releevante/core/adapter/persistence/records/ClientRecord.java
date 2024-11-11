package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.LazyLoaderInit;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Objects;
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

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
  ServiceRatingRecord serviceRating;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client", cascade = CascadeType.PERSIST)
  Set<BookLoanRecord> bookLoans = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client", cascade = CascadeType.PERSIST)
  @OrderBy("createdAt DESC")
  Set<BookReservationRecord> reservations = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client", cascade = CascadeType.PERSIST)
  @OrderBy("createdAt DESC")
  Set<BookRatingRecord> bookRatings = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client", cascade = CascadeType.PERSIST)
  @OrderBy("createdAt DESC")
  Set<BookSaleRecord> purchases = new LinkedHashSet<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "client", cascade = CascadeType.PERSIST)
  @OrderBy("createdAt DESC")
  Set<CartRecord> carts = new LinkedHashSet<>();

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
    var loanRecords = BookLoanRecord.fromDomain(clientRecord, client.loans().get());
    clientRecord.getBookLoans().addAll(loanRecords);
    return clientRecord;
  }

  public static ClientRecord bookReservations(Client client) {
    var clientRecord = fromDomain(client);
    var reservationRecords =
        BookReservationRecord.fromDomain(clientRecord, client.reservations().get());
    clientRecord.getReservations().addAll(reservationRecords);
    return clientRecord;
  }

  public static ClientRecord bookRatings(Client client) {
    var clientRecord = fromDomain(client);
    var ratingRecords = BookRatingRecord.fromDomain(clientRecord, client.bookRatings().get());
    clientRecord.getBookRatings().addAll(ratingRecords);
    return clientRecord;
  }

  public static ClientRecord bookPurchases(Client client) {
    var clientRecord = fromDomain(client);
    var bookSaleRecords = BookSaleRecord.fromDomain(clientRecord, client.purchases().get());
    clientRecord.getPurchases().addAll(bookSaleRecords);
    return clientRecord;
  }

  public static ClientRecord carts(Client client) {
    var clientRecord = fromDomain(client);
    var bookSaleRecords = CartRecord.fromDomain(clientRecord, client.carts().get());
    clientRecord.getCarts().addAll(bookSaleRecords);
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

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ClientRecord that = (ClientRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
