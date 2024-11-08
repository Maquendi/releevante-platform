package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookHibernateDao extends JpaRepository<BookRecord, String> {}
