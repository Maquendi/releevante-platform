package com.releevante.core.adapter.persistence.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookSaleItemHibernateDao extends JpaRepository<BookSaleItemsRecord, String> {}
