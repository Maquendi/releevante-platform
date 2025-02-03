package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookSaleRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookSaleHibernateDao extends ReactiveCrudRepository<BookSaleRecord, String> {}
