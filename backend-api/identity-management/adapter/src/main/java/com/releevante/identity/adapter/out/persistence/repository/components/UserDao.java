package com.releevante.identity.adapter.out.persistence.repository.components;

import com.releevante.identity.adapter.out.persistence.records.UserRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<UserRecord, String> {
  Optional<UserRecord> findByAccountId(String accountId);
}
