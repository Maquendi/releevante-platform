package com.releevante.identity.adapter.out.persistence.repository.components;

import com.releevante.identity.adapter.out.persistence.records.UserRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<UserRecord, String> {}
