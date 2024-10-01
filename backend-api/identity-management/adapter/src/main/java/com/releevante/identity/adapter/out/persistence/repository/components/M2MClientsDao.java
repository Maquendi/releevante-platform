/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.repository.components;

import com.releevante.identity.adapter.out.persistence.records.M2MClientRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface M2MClientsDao extends JpaRepository<M2MClientRecord, String> {
  Optional<M2MClientRecord> findByIdAndSecret(String clientId, String clientSecret);
}
