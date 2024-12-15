package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.LoanItem;
import java.util.*;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "loan_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class LoanItemsRecord extends SimplePersistable {
  @Id private String id;
  private String cpy;
  private String loanId;

  @Transient private Set<LoanItemStatusRecord> loanItemStatuses = new HashSet<>();

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    LoanItemsRecord that = (LoanItemsRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  protected static Set<LoanItemsRecord> fromDomain(BookLoan loan) {
    return loan.items().stream().map(item -> from(loan, item)).collect(Collectors.toSet());
  }

  private static LoanItemsRecord from(BookLoan loan, LoanItem item) {
    var record = new LoanItemsRecord();
    record.setId(item.id());
    record.setCpy(item.cpy().orElse(null));
    record.setLoanId(loan.id().value());
    record.setLoanItemStatuses(LoanItemStatusRecord.from(record, item, loan));
    return record;
  }
}
