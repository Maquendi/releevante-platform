package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookLoan;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookLoanRepository {
  Mono<Boolean> upsert(List<BookLoan> loans);

  Flux<BookLoan> getActive(Slid slid);
}
