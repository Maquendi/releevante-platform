package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Predicate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;
import reactor.core.publisher.Mono;

@Table(name = "clients", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class ClientRecord extends PersistableEntity {
  @Id String id;

  ZonedDateTime createdAt;

  ZonedDateTime updatedAt;

  @Transient ServiceRatingRecord serviceRating;

  @Transient Set<BookLoanRecord> bookLoans = new LinkedHashSet<>();

  @Transient Set<BookReservationRecord> reservations = new LinkedHashSet<>();

  @Transient Set<BookRatingRecord> bookRatings = new LinkedHashSet<>();

  @Transient Set<BookSaleRecord> purchases = new LinkedHashSet<>();

  @Transient Set<CartRecord> carts = new LinkedHashSet<>();

  protected static ClientRecord fromDomain(Client client) {
    var record = new ClientRecord();
    record.setId(client.id().value());
    record.setCreatedAt(client.createdAt());
    record.setUpdatedAt(client.updatedAt());
    return record;
  }

  public static Mono<ClientRecord> serviceRating(Client client) {
    return Mono.just(client.serviceRating())
        .filter(Optional::isPresent)
        .map(Optional::get)
        .map(
            rating -> {
              var clientRecord = fromDomain(client);
              var ratingRecord = ServiceRatingRecord.fromDomain(clientRecord, rating);
              clientRecord.setServiceRating(ratingRecord);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> bookLoans(Client client) {
    return Mono.just(client.loans())
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
    return Mono.just(client.reservations())
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
    return Mono.just(client.bookRatings())
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
    return Mono.just(client.purchases())
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
    return Mono.just(client.carts())
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
    return Client.builder().id(ClientId.of(id)).build();
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
