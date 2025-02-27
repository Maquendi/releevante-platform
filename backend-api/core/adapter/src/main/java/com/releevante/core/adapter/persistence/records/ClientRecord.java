package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
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

  @Transient ServiceRatingRecord serviceRating;

  @Transient Set<BookTransactionRecord> transactions = new LinkedHashSet<>();

  @Transient Set<BookReservationRecord> reservations = new LinkedHashSet<>();

  @Transient Set<BookRatingRecord> bookRatings = new LinkedHashSet<>();

  protected static ClientRecord fromDomain(Client client) {
    var record = new ClientRecord();
    record.setId(client.id().value());
    record.setCreatedAt(client.createdAt());
    record.setUpdatedAt(client.updatedAt());
    record.setNew(true);
    return record;
  }

  public static Mono<ClientRecord> serviceRating(Client client) {
    return Mono.just(client.serviceRating())
        .filter(Optional::isPresent)
        .map(Optional::get)
        .map(
            rating -> {
              var clientRecord = fromDomain(client);
              var ratingRecord = ServiceRatingRecord.fromDomain(rating);
              clientRecord.setServiceRating(ratingRecord);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> createTransactions(Client client) {
    return Mono.just(client.transactions())
        .filter(Predicate.not(List::isEmpty))
        .map(
            transactions -> {
              var clientRecord = fromDomain(client);
              var transactionRecords = BookTransactionRecord.fromDomain(clientRecord, transactions);
              clientRecord.getTransactions().addAll(transactionRecords);
              return clientRecord;
            });
  }

  public static Mono<ClientRecord> bookReservations(Client client) {
    return Mono.just(client.reservations())
        .filter(Predicate.not(List::isEmpty))
        .map(
            bookReservations -> {
              var clientRecord = fromDomain(client);
              var reservationRecords = BookReservationRecord.fromDomain(bookReservations);
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
              var ratingRecords = BookRatingRecord.fromDomain(ratings);
              clientRecord.getBookRatings().addAll(ratingRecords);
              return clientRecord;
            });
  }

  public Client toDomain() {
    return Client.builder().createdAt(createdAt).updatedAt(updatedAt).id(ClientId.of(id)).build();
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
