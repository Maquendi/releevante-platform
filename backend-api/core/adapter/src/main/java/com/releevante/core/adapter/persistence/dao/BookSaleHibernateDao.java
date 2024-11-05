package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookSaleRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookSaleHibernateDao extends JpaRepository<BookSaleRecord, String> {}
