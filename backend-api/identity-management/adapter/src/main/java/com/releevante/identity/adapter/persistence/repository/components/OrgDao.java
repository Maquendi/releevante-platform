package com.releevante.identity.adapter.persistence.repository.components;

import com.releevante.identity.adapter.persistence.records.OrgRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface OrgDao extends ReactiveCrudRepository<OrgRecord, String> {}
