/* (C)2024 */
package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.M2MClient;
import com.releevante.identity.domain.model.Password;
import com.releevante.identity.domain.model.UserName;
import reactor.core.publisher.Mono;

public interface M2MClientsRepository {
  Mono<M2MClient> findBy(UserName clientId, Password clientSecret);
}
