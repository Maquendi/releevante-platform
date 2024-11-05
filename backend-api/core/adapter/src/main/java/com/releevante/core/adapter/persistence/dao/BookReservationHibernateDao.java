package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookReservationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookReservationHibernateDao extends JpaRepository<BookReservationRecord, String> {}
