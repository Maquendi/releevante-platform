package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.LoanItemStatus;
import com.releevante.core.domain.LoanItemStatuses;
import java.util.List;
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
public class LoanItemStatusRecord extends SimplePersistable {
  String id;
  String itemId;
  LoanItemStatuses status;

  public static Set<LoanItemStatusRecord> many(List<LoanItemStatus> statuses) {
    return statuses.stream().map(LoanItemStatusRecord::fromDomain).collect(Collectors.toSet());
  }

  protected static LoanItemStatusRecord fromDomain(LoanItemStatus item) {
    var record = new LoanItemStatusRecord();
    record.setId(item.id());
    record.setItemId(item.itemId());
    record.setStatus(item.statuses());
    record.setCreatedAt(item.createdAt());
    return record;
  }
}
