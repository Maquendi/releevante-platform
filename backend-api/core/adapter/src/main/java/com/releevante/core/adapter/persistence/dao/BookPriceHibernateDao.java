package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookPriceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookPriceHibernateDao extends JpaRepository<BookPriceRecord, String> {}
