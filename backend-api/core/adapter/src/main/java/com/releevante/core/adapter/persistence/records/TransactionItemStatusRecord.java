package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.*;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "transaction_item_status", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class TransactionItemStatusRecord extends AuditableEntity {
  @Id String id;
  String itemId;
  TransactionItemStatusEnum status;
  boolean isSynced;

  public static Set<TransactionItemStatusRecord> from(TransactionItem item) {
    return item.status().stream()
        .map(TransactionItemStatusRecord::fromDomain)
        .collect(Collectors.toSet());
  }

  public static TransactionItemStatusRecord fromDomain(TransactionItemStatus status) {
    var record = new TransactionItemStatusRecord();
    record.setId(status.id());
    record.setItemId(status.itemId());
    record.setStatus(status.status());
    record.setCreatedAt(status.createdAt());
    record.setOrigin(status.origin());
    record.setAudit(status.audit());
    return record;
  }
}
