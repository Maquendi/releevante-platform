package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.TransactionItemRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface TransactionItemHibernateDao
    extends ReactiveCrudRepository<TransactionItemRecord, String> {

  Flux<TransactionItemRecord> findAllByTransactionId(String transactionId);
}
