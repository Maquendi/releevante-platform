package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.AuthorizedOriginRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorizedOriginRecordHibernateDao
    extends ReactiveCrudRepository<AuthorizedOriginRecord, String> {}
