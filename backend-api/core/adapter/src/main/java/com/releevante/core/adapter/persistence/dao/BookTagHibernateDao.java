package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookTagRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookTagHibernateDao extends ReactiveCrudRepository<BookTagRecord, String> {}
