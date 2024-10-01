package com.releevante.identity.adapter.out.persistence.repository.components;

import com.releevante.identity.adapter.out.persistence.records.OrgRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgDao extends JpaRepository<OrgRecord, String> {}
