package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookLoanRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookLoanHibernateDao extends JpaRepository<BookLoanRecord, String> {}
