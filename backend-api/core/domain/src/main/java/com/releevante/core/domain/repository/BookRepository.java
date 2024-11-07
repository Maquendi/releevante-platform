package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookSale;
import java.util.List;
import reactor.core.publisher.Mono;

public interface BookRepository {
  Mono<BookSale> save(BookSale bookSale);

  Mono<BookLoan> save(BookLoan loan);

  Mono<List<BookLoan>> save(List<BookLoan> loan);
}
