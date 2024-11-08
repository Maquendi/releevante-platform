package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import com.releevante.types.Slid;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.List;
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
  @JoinColumn(name = "client_id")
  private ClientRecord client;

  public BookLoan toDomain() {
    return BookLoan.builder()
        .id(BookLoanId.of(loanId))
        .startTime(startTime)
        .endTime(endTime)
        .slid(Slid.of(slid))
        .bookReturnTime(returnedAt)
        .cart(() -> getCart().toDomain())
        .build();
  }

  public static BookLoanRecord fromDomain(BookLoan loan) {
    var record = new BookLoanRecord();
    record.setLoanId(loan.id().value());
    record.setCart(CartRecord.fromDomain(loan.cart().get()));
    record.setStartTime(loan.startTime());
    record.setEndTime(loan.endTime());
    record.setSlid(loan.slid().value());
    record.setClient(ClientRecord.from(loan.clientId()));
    return record;
  }

  public static Set<BookLoanRecord> fromDomain(List<BookLoan> loans) {
    return loans.stream().map(BookLoanRecord::fromDomain).collect(Collectors.toSet());
  }
}
