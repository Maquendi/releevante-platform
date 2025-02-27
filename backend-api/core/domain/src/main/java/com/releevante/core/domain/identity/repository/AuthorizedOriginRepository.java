package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.AuthorizedOrigin;
import reactor.core.publisher.Mono;

public interface AuthorizedOriginRepository {
  Mono<AuthorizedOrigin> findById(String id);
}
