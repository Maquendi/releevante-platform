package com.releevante.identity.adapter.persistence.repository.components;

import com.releevante.identity.adapter.persistence.records.UserRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface UserDao extends ReactiveCrudRepository<UserRecord, String> {
  Mono<UserRecord> findByAccountId(String accountId);
}
