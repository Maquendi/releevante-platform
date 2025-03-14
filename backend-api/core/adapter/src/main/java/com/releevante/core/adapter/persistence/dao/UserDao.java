package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.UserRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface UserDao extends ReactiveCrudRepository<UserRecord, String> {}
