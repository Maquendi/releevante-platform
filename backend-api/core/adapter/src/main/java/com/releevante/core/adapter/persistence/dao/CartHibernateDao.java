package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.CartRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartHibernateDao extends ReactiveCrudRepository<CartRecord, String> {}
