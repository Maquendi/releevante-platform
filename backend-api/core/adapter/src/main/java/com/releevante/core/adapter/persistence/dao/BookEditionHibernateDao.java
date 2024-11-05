package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookEditionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookEditionHibernateDao extends JpaRepository<BookEditionRecord, String> {}
