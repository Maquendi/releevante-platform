package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import com.releevante.core.domain.LazyLoaderInit;
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

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
  @MapsId
  private CartRecord cart;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "loan", cascade = CascadeType.PERSIST)
  private Set<LoanDetailRecord> loanDetails = new LinkedHashSet<>();

  private ZonedDateTime startTime;

  private ZonedDateTime endTime;

  private ZonedDateTime returnedAt;

  private String slid;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private ClientRecord client;

  public BookLoan toDomain() {
    return BookLoan.builder()
        .id(BookLoanId.of(id))
        .startTime(startTime)
        .endTime(endTime)
        .slid(Slid.of(slid))
        .bookReturnTime(returnedAt)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .client(new LazyLoaderInit<>(() -> getClient().toDomain()))
        .cart(new LazyLoaderInit<>(() -> getCart().toDomain()))
        .build();
  }

  protected static Set<BookLoanRecord> fromDomain(ClientRecord client, List<BookLoan> loans) {
    return loans.stream().map(loan -> fromDomain(client, loan)).collect(Collectors.toSet());
  }

  private static BookLoanRecord fromDomain(ClientRecord client, BookLoan loan) {
    var record = new BookLoanRecord();
    record.setId(loan.id().value());
    record.setCart(CartRecord.fromDomain(client, loan.cart().get()));
    record.setLoanDetails(LoanDetailRecord.fromDomain(record, loan.loanDetails().get()));
    record.setStartTime(loan.startTime());
    record.setEndTime(loan.endTime());
    record.setSlid(loan.slid().value());
    record.setCreatedAt(loan.createdAt());
    record.setUpdatedAt(loan.updatedAt());
    record.setClient(client);
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
