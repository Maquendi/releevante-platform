/* (C)2024 */
package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.User;
import reactor.core.publisher.Mono;

public interface UserRepository {
  Mono<User> upsert(User user);
}
