package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.ClientRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface ClientHibernateDao extends ReactiveCrudRepository<ClientRecord, String> {
  Mono<ClientRecord> findByIdOrExternalId(String id);
}
