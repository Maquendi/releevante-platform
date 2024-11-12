package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.LoanDetail;
import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "loan_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class LoanItemsRecord {
  @Id private String id;
  private String cpy;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "loan_id")
  private BookLoanRecord loan;

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

  protected static Set<LoanItemsRecord> fromDomain(
      BookLoanRecord record, List<LoanDetail> loanDetails) {
    return loanDetails.stream()
        .map(loanDetail -> fromDomain(record, loanDetail))
        .collect(Collectors.toSet());
  }

  private static LoanItemsRecord fromDomain(BookLoanRecord loan, LoanDetail loanDetail) {
    var record = new LoanItemsRecord();
    record.setId(loanDetail.id());
    record.setCpy(loanDetail.bookCopy());
    record.setLoan(loan);
    return record;
  }
}
