package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.TaskRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskHibernateDao extends ReactiveCrudRepository<TaskRecord, String> {}
