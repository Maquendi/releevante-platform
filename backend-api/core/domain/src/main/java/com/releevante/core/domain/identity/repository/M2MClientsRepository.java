/* (C)2024 */
package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.M2MClient;
import com.releevante.core.domain.identity.model.Password;
import com.releevante.core.domain.identity.model.UserName;
import reactor.core.publisher.Mono;

public interface M2MClientsRepository {
  Mono<M2MClient> findBy(UserName clientId, Password clientSecret);
}
