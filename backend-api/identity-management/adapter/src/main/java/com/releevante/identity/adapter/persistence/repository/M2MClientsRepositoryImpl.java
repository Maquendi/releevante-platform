/* (C)2024 */
package com.releevante.identity.adapter.persistence.repository;

import com.releevante.identity.adapter.persistence.records.M2MClientRecord;
import com.releevante.identity.adapter.persistence.repository.components.M2MClientsDao;
import com.releevante.identity.domain.model.M2MClient;
import com.releevante.identity.domain.model.Password;
import com.releevante.identity.domain.model.UserName;
import com.releevante.identity.domain.repository.M2MClientsRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class M2MClientsRepositoryImpl implements M2MClientsRepository {
  final M2MClientsDao m2MClientsDao;

  public M2MClientsRepositoryImpl(M2MClientsDao m2MClientsDao) {
    this.m2MClientsDao = m2MClientsDao;
  }

  @Override
  public Mono<M2MClient> findBy(UserName clientId, Password clientSecret) {
    return Mono.justOrEmpty(m2MClientsDao.findByIdAndSecret(clientId.value(), clientSecret.value()))
        .map(M2MClientRecord::toDomain);
  }
}
