package com.releevante.identity.adapter.persistence.repository.components;

import com.releevante.identity.adapter.persistence.records.SmartLibraryAccessRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SmartLibraryAccessDao extends JpaRepository<SmartLibraryAccessRecord, String> {
  Optional<SmartLibraryAccessRecord> findByCredential(String credential);
}
