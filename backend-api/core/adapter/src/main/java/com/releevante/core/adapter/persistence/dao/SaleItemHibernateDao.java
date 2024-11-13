package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.SaleItemsRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleItemHibernateDao extends JpaRepository<SaleItemsRecord, String> {}
