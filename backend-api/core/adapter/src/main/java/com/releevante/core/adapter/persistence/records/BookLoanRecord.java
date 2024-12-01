package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_loans", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookLoanRecord extends AuditableEntity {

  @Id private String id;

  private String origin;

  private String externalId;

  private ZonedDateTime returnsAt;

  private ZonedDateTime returnedAt;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  private String clientId;

  @Transient private Set<LoanItemsRecord> loanDetails = new HashSet<>();

  @Transient private Set<LoanStatusRecord> loanStatus = new HashSet<>();

  public BookLoan toDomain() {
    return BookLoan.builder()
        .id(BookLoanId.of(id))
        .origin(origin)
        .returnedAt(returnedAt)
        .returnsAt(returnsAt)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .externalId(BookLoanId.of(externalId))
        .build();
  }

  protected static Set<BookLoanRecord> fromDomain(ClientRecord client, List<BookLoan> loans) {
    return loans.stream().map(loan -> fromDomain(client, loan)).collect(Collectors.toSet());
  }

  private static BookLoanRecord fromDomain(ClientRecord client, BookLoan loan) {
    var record = new BookLoanRecord();
    record.setId(loan.id().value());
    record.setOrigin(loan.origin());
    record.setCreatedAt(loan.createdAt());
    record.setUpdatedAt(loan.updatedAt());
    record.setReturnsAt(loan.returnsAt());
    record.setReturnedAt(loan.returnedAt().orElse(null));
    record.setNew(loan.isNew());
    record.setClientId(client.getId());
    record.setExternalId(loan.externalId().value());
    record.setOrigin(loan.origin());
    record.setAudit(loan.audit());
    record.setLoanDetails(LoanItemsRecord.fromDomain(record, loan.loanDetails()));
    record.setLoanStatus(LoanStatusRecord.fromDomain(record, loan.loanStatus()));
    return record;
  }

  public static List<BookLoan> toDomain(Set<BookLoanRecord> loans) {
    return loans.stream().map(BookLoanRecord::toDomain).collect(Collectors.toList());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookLoanRecord that = (BookLoanRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
