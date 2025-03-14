/* (C)2024 */
package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.AccountRecord;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;

public interface AccountDao extends R2dbcRepository<AccountRecord, String> {
  Mono<AccountRecord> findByUserName(String userName);

  Mono<AccountRecord> findByUserNameAndPasswordHash(String userName, String passwordHash);
}
