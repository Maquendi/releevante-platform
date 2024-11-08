package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookRatingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRatingHibernateDao extends JpaRepository<BookRatingRecord, String> {
}
