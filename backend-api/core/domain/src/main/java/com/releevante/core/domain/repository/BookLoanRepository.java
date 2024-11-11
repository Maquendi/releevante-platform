package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookLoan;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;

public interface BookLoanRepository {

  Flux<BookLoan> getActive(Slid slid);
}
