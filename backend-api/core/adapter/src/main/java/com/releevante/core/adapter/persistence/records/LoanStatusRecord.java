package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.LoanStatus;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "loan_status", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class LoanStatusRecord extends AuditableEntity {
  @Id private String id;
  private String loanId;
  private String status;

  public static Set<LoanStatusRecord> fromDomain(
      BookLoanRecord loan, List<LoanStatus> loanStatuses) {
    return loanStatuses.stream()
        .map(status -> fromDomain(loan, status))
        .collect(Collectors.toSet());
  }

  private static LoanStatusRecord fromDomain(BookLoanRecord loan, LoanStatus loanStatus) {
    var record = new LoanStatusRecord();
    record.setId(loanStatus.id());
    record.setCreatedAt(loanStatus.createdAt());
    record.setStatus(loanStatus.status().name());
    record.setLoanId(loan.getId());
    record.setOrigin(loan.getOrigin());
    record.setAudit(loan.getAudit());
    return record;
  }
}
