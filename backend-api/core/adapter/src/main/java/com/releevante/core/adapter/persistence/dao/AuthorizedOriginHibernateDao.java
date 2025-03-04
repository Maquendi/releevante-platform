package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.AuthorizedOriginRecord;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface AuthorizedOriginHibernateDao
    extends R2dbcRepository<AuthorizedOriginRecord, String> {
  Flux<AuthorizedOriginRecord> findAllByOrgIdAndIsActiveTrue(String orgId);
}
