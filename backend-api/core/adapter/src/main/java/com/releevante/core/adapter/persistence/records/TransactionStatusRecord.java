package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookTransaction;
import com.releevante.core.domain.TransactionStatus;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "transaction_status", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class TransactionStatusRecord extends AuditableEntity {
  @Id private String id;
  private String transactionId;
  private String status;
  boolean isSynced;

  public static Set<TransactionStatusRecord> fromDomain(BookTransaction transaction) {
    return transaction.status().stream()
        .map(TransactionStatusRecord::fromDomain)
        .collect(Collectors.toSet());
  }

  public static TransactionStatusRecord fromDomain(TransactionStatus status) {
    var record = new TransactionStatusRecord();
    record.setId(status.id());
    record.setCreatedAt(status.createdAt());
    record.setStatus(status.status().name());
    record.setTransactionId(status.transactionId().value());
    record.setOrigin(status.origin());
    record.setAudit(status.audit());
    return record;
  }
}
