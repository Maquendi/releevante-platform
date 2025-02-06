package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookTransaction;
import com.releevante.core.domain.TransactionItem;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "transaction_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class TransactionItemRecord extends SimplePersistable {
  @Id private String id;
  private String cpy;
  private String transactionId;
  private BigDecimal price;

  @Transient private Set<TransactionItemStatusRecord> transactionItemStatuses = new HashSet<>();

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    TransactionItemRecord that = (TransactionItemRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  protected static Set<TransactionItemRecord> fromDomain(BookTransaction transaction) {
    return transaction.items().stream()
        .map(item -> from(transaction, item))
        .collect(Collectors.toSet());
  }

  private static TransactionItemRecord from(BookTransaction transaction, TransactionItem item) {
    var record = new TransactionItemRecord();
    record.setId(item.id());
    record.setCpy(item.cpy());
    record.setTransactionId(transaction.id().value());
    record.setTransactionItemStatuses(TransactionItemStatusRecord.from(item));
    return record;
  }
}
