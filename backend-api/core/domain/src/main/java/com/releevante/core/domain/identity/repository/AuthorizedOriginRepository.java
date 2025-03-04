package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.AuthorizedOrigin;
import com.releevante.core.domain.identity.model.OrgId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AuthorizedOriginRepository {
  Mono<AuthorizedOrigin> findById(String id);

  Flux<AuthorizedOrigin> findById(OrgId orgId);
}
