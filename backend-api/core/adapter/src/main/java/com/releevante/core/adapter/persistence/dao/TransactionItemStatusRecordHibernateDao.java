package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.TransactionItemStatusRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionItemStatusRecordHibernateDao
    extends ReactiveCrudRepository<TransactionItemStatusRecord, String> {}
