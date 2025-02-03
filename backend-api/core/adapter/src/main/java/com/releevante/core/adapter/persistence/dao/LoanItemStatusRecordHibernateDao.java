package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.LoanItemStatusRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanItemStatusRecordHibernateDao
    extends ReactiveCrudRepository<LoanItemStatusRecord, String> {}
