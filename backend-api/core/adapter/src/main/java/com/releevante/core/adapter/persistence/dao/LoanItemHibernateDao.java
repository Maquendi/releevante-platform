package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.LoanItemsRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanItemHibernateDao extends ReactiveCrudRepository<LoanItemsRecord, String> {}
