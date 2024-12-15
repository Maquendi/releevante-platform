package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.*;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "loan_item_status", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class LoanItemStatusRecord extends AuditableEntity {
  String id;
  String itemId;
  LoanItemStatuses status;

  public static Set<LoanItemStatusRecord> from(
      LoanItemsRecord record, LoanItem item, BookLoan loan) {
    return item.statuses().stream()
        .map((status) -> fromDomain(record, status, loan))
        .collect(Collectors.toSet());
  }

  protected static LoanItemStatusRecord fromDomain(
      LoanItemsRecord loanItemsRecord, LoanItemStatus status, BookLoan loan) {
    var record = new LoanItemStatusRecord();
    record.setId(status.id());
    record.setItemId(loanItemsRecord.getId());
    record.setStatus(status.status());
    record.setCreatedAt(status.createdAt());
    record.setOrigin(loan.origin());
    record.setAudit(loan.audit());
    return record;
  }
}
