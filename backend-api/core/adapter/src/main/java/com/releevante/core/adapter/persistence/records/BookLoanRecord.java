package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import com.releevante.types.Slid;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_loans", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookLoanRecord {

  @Id private String id;

  private String slid;

  private ZonedDateTime returnsAt;

  private ZonedDateTime returnedAt;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  private String clientId;

  @Transient private Set<LoanItemsRecord> loanDetails = new LinkedHashSet<>();

  public BookLoan toDomain() {
    return BookLoan.builder()
        .id(BookLoanId.of(id))
        .slid(Slid.of(slid))
        .returnedAt(returnedAt)
        .returnsAt(returnsAt)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .build();
  }

  protected static Set<BookLoanRecord> fromDomain(ClientRecord client, List<BookLoan> loans) {
    return loans.stream().map(loan -> fromDomain(client, loan)).collect(Collectors.toSet());
  }

  private static BookLoanRecord fromDomain(ClientRecord client, BookLoan loan) {
    var record = new BookLoanRecord();
    record.setId(loan.id().value());
    record.setLoanDetails(LoanItemsRecord.fromDomain(record, loan.loanDetails()));
    record.setSlid(loan.slid().value());
    record.setCreatedAt(loan.createdAt());
    record.setUpdatedAt(loan.updatedAt());
    record.setReturnsAt(loan.returnsAt());
    record.setReturnedAt(loan.returnedAt().orElse(null));
    record.setClientId(client.getId());
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
