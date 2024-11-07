package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_loan_status", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookLoanStatusRecord {
  @Id private String loanId;

  private ZonedDateTime startTime;

  private ZonedDateTime estimatedEndTime;
}
