package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.LoanStatusRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanStatusHibernateDao extends ReactiveCrudRepository<LoanStatusRecord, String> {}
