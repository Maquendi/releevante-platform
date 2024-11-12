package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookReservationItemsRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookReservationItemHibernateDao
    extends JpaRepository<BookReservationItemsRecord, String> {}
