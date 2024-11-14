package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookReservationRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookReservationHibernateDao
    extends ReactiveCrudRepository<BookReservationRecord, String> {}
