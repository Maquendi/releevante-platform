package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookLoan;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import reactor.core.publisher.Flux;

public interface BookLoanRepository {
  Flux<BookLoan> findActiveLoans(Slid slid);

  Flux<BookLoan> findCreatedInRange(ZonedDateTime start, ZonedDateTime end);

  Flux<BookLoan> getByAllUnSynchronized();
}
