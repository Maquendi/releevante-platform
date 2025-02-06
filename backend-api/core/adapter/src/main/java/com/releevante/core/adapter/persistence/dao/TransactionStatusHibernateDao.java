package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.TransactionStatusRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionStatusHibernateDao
    extends ReactiveCrudRepository<TransactionStatusRecord, String> {}
