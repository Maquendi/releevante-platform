package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.SmartLibraryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SmartLibraryHibernateDao extends JpaRepository<SmartLibraryRecord, String> {}
