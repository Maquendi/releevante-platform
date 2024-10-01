/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.repository.components;

import com.releevante.identity.adapter.out.persistence.records.AccountRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountDao extends JpaRepository<AccountRecord, String> {
  Optional<AccountRecord> findByUserName(String userName);

  Optional<AccountRecord> findByUserNameAndPasswordHash(String userName, String passwordHash);
}
