package com.releevante.identity.adapter.out.persistence.repository.components;

import com.releevante.identity.adapter.out.persistence.records.SmartLibraryAccessControlRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SmartLibraryAccessControlDao
    extends JpaRepository<SmartLibraryAccessControlRecord, String> {
  Optional<SmartLibraryAccessControlRecord> findByCredential(String credential);
}
