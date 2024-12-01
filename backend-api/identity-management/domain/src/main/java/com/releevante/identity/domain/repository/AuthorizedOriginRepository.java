package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.AuthorizedOrigin;
import reactor.core.publisher.Mono;

public interface AuthorizedOriginRepository {
  Mono<AuthorizedOrigin> findById(String id);
}
