package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.AuthorizedOriginRecord;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorizedOriginHibernateDao
    extends R2dbcRepository<AuthorizedOriginRecord, String> {}
