package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.OrgRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface OrgDao extends ReactiveCrudRepository<OrgRecord, String> {}
