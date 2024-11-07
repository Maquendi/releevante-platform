package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_loan_detail", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookLoanDetailRecord {
  private String id;
  @OneToOne private SmartLibraryBookInventoryRecord book;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "loan_id")
  private BookLoanRecord loan;
}
