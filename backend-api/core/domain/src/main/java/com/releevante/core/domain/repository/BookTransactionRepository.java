package com.releevante.core.domain.repository;

import com.releevante.core.domain.BookTransaction;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.identity.model.OrgId;
import reactor.core.publisher.Flux;

public interface BookTransactionRepository {
  Flux<BookTransaction> findAll();

  Flux<BookTransaction> findAll(OrgId orgId);

  Flux<BookTransaction> findByClientId(ClientId clientId);
}
