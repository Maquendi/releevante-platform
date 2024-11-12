package com.releevante.identity.adapter.persistence.repository.components;

import com.releevante.identity.adapter.persistence.records.OrgRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgDao extends JpaRepository<OrgRecord, String> {}
