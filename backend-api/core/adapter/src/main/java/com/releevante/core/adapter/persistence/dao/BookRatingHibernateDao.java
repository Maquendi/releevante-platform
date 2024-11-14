package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookRatingRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRatingHibernateDao extends ReactiveCrudRepository<BookRatingRecord, String> {}
