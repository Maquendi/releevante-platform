package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookSaleItemsRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookSaleItemHibernateDao extends JpaRepository<BookSaleItemsRecord, String> {}
