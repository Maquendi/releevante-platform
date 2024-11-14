package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookReservationItemsRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookReservationItemHibernateDao
    extends ReactiveCrudRepository<BookReservationItemsRecord, String> {}
