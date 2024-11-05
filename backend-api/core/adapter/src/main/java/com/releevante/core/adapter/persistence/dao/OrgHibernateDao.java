package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.OrgRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrgHibernateDao extends JpaRepository<OrgRecord, String> {}
