package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.CartRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartHibernateDao extends JpaRepository<CartRecord, String> {}
