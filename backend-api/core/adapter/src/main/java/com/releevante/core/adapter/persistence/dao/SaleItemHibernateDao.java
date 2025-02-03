package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.SaleItemsRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleItemHibernateDao extends ReactiveCrudRepository<SaleItemsRecord, String> {}
