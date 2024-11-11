package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import com.releevante.core.domain.LazyLoaderInit;
import com.releevante.types.Slid;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
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

  private String loanId;

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
  @JoinColumn(name = "cart_id")
  private CartRecord cart;

  private ZonedDateTime startTime;

  private ZonedDateTime endTime;

  private ZonedDateTime returnedAt;

  private String slid;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private ClientRecord client;

  public BookLoan toDomain() {
    return BookLoan.builder()
        .id(BookLoanId.of(loanId))
        .startTime(startTime)
        .endTime(endTime)
        .slid(Slid.of(slid))
        .bookReturnTime(returnedAt)
        .client(new LazyLoaderInit<>(() -> getClient().toDomain()))
        .cart(new LazyLoaderInit<>(() -> getCart().toDomain()))
        .build();
  }

  protected static BookLoanRecord fromDomain(BookLoan loan) {
    var record = new BookLoanRecord();
    record.setLoanId(loan.id().value());
    record.setCart(CartRecord.fromDomain(loan.cart().get()));
    record.setStartTime(loan.startTime());
    record.setEndTime(loan.endTime());
    record.setSlid(loan.slid().value());
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
    return Objects.equals(loanId, that.loanId);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
