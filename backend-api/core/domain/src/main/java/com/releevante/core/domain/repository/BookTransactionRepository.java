package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookTransaction;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import reactor.core.publisher.Flux;

public interface BookTransactionRepository {
  Flux<BookLoan> findActiveLoans(Slid slid);

  Flux<BookLoan> findCreatedInRange(ZonedDateTime start, ZonedDateTime end);

  Flux<BookLoan> getByAllUnSynchronized();

  Flux<BookTransaction> findAll();

  Flux<BookTransaction> findAll(OrgId orgId);

  Flux<BookTransaction> findByClientId(ClientId clientId);
}
