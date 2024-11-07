package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookLoanId;
import com.releevante.core.domain.ClientId;
import com.releevante.types.Slid;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
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
  private String clientIdStr;
  @OneToOne private CartRecord cart;
  private ZonedDateTime startTime;
  private ZonedDateTime estimatedEndTime;
  private ZonedDateTime bookReturnedTime;
  private String slid;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "client_id")
  private ClientRecord client;

  public BookLoan toDomain() {
    return BookLoan.builder()
        .id(BookLoanId.of(loanId))
        .clientId(ClientId.of(clientIdStr))
        .startTime(startTime)
        .endTime(estimatedEndTime)
        .slid(Slid.of(slid))
        .bookReturnTime(bookReturnedTime)
        .cart(getCart().toDomain())
        .build();
  }

  public static BookLoanRecord fromDomain(BookLoan loan) {

    var record = new BookLoanRecord();
    record.setLoanId(loan.id().value());
    record.setClientIdStr(loan.clientId().value());
    record.setCart(CartRecord.fromDomain(loan.cart()));
    record.setStartTime(loan.startTime());
    record.setEstimatedEndTime(loan.endTime());
    record.setSlid(loan.slid().value());

    return record;
  }
}
