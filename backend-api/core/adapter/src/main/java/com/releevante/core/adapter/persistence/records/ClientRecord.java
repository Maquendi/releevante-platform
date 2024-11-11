package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.LazyLoaderInit;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Predicate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reactor.core.publisher.Mono;

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
    return record;
  }

  public static Mono<ClientRecord> serviceRating(Client client) {
    return Mono.just(client.serviceRating().get())
        .filter(Objects::nonNull)
        .map(
            rating -> {
              var clientRecord = fromDomain(client);
              var ratingRecord = ServiceRatingRecord.fromDomain(rating);
              ratingRecord.setClient(clientRecord);
              clientRecord.setServiceRating(ratingRecord);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> bookLoans(Client client) {
    return Mono.just(client.loans().get())
        .filter(Predicate.not(List::isEmpty))
        .map(
            loans -> {
              var clientRecord = fromDomain(client);
              var loanRecords = BookLoanRecord.fromDomain(clientRecord, loans);
              clientRecord.getBookLoans().addAll(loanRecords);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> bookReservations(Client client) {
    return Mono.just(client.reservations().get())
        .filter(Predicate.not(List::isEmpty))
        .map(
            bookReservations -> {
              var clientRecord = fromDomain(client);
              var reservationRecords =
                  BookReservationRecord.fromDomain(clientRecord, bookReservations);
              clientRecord.getReservations().addAll(reservationRecords);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> bookRatings(Client client) {
    return Mono.just(client.bookRatings().get())
        .filter(Predicate.not(List::isEmpty))
        .map(
            ratings -> {
              var clientRecord = fromDomain(client);
              var ratingRecords = BookRatingRecord.fromDomain(clientRecord, ratings);
              clientRecord.getBookRatings().addAll(ratingRecords);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> bookPurchases(Client client) {
    return Mono.just(client.purchases().get())
        .filter(Predicate.not(List::isEmpty))
        .map(
            sales -> {
              var clientRecord = fromDomain(client);
              var bookSaleRecords = BookSaleRecord.fromDomain(clientRecord, sales);
              clientRecord.getPurchases().addAll(bookSaleRecords);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> carts(Client client) {
    return Mono.just(client.carts().get())
        .filter(Predicate.not(List::isEmpty))
        .map(
            carts -> {
              var clientRecord = fromDomain(client);
              var bookSaleRecords = CartRecord.fromDomain(clientRecord, carts);
              clientRecord.getCarts().addAll(bookSaleRecords);
              return clientRecord;
            });
  }

  public Client toDomain() {
    return Client.builder()
        .id(ClientId.of(id))
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
