package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookHibernateDao extends ReactiveCrudRepository<BookRecord, String> {}
