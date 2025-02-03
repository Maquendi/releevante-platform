package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookLoanRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookLoanHibernateDao extends ReactiveCrudRepository<BookLoanRecord, String> {}
