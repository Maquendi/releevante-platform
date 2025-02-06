package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookTransactionRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookTransactionHibernateDao
    extends ReactiveCrudRepository<BookTransactionRecord, String> {}
