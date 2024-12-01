package com.releevante.identity.adapter.persistence.repository.components;

import com.releevante.identity.adapter.persistence.records.AuthorizedOriginRecord;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorizedOriginHibernateDao
    extends R2dbcRepository<AuthorizedOriginRecord, String> {}
