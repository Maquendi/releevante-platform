/* (C)2024 */
package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.AccountId;
import com.releevante.core.domain.identity.model.User;
import reactor.core.publisher.Mono;

public interface UserRepository {
  Mono<User> upsert(User user);

  Mono<User> findBy(AccountId accountId);
}
