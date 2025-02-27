package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.*;
import java.util.*;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_transactions", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookTransactionRecord extends AuditableEntity {

  @Id private String id;

  private String externalId;

  private String clientId;

  private String transactionType;

  @Transient private Set<TransactionItemRecord> loanItems = new HashSet<>();

  @Transient private Set<TransactionStatusRecord> transactionStatus = new HashSet<>();

  public BookTransaction toDomain() {
    return BookTransaction.builder()
        .transactionType(BookTransactionType.valueOf(transactionType))
        .externalId(TransactionId.of(externalId))
        .id(TransactionId.of(id))
        .origin(origin)
        .createdAt(createdAt)
        .build();
  }

  protected static Set<BookTransactionRecord> fromDomain(
      ClientRecord client, List<BookTransaction> transactions) {
    return transactions.stream()
        .map(transaction -> fromDomain(client, transaction))
        .collect(Collectors.toSet());
  }

  private static BookTransactionRecord fromDomain(
      ClientRecord client, BookTransaction transaction) {
    var record = new BookTransactionRecord();
    record.setId(transaction.id().value());
    record.setExternalId(transaction.externalId().value());
    record.setOrigin(transaction.origin());
    record.setCreatedAt(transaction.createdAt());
    record.setClientId(client.getId());
    record.setTransactionType(transaction.transactionType().name());
    record.setOrigin(transaction.origin());
    record.setAudit(transaction.audit());
    record.setLoanItems(TransactionItemRecord.fromDomain(transaction));
    record.setTransactionStatus(TransactionStatusRecord.fromDomain(transaction));
    return record;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookTransactionRecord that = (BookTransactionRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
