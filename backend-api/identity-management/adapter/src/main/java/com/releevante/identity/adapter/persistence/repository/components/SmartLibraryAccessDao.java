package com.releevante.identity.adapter.persistence.repository.components;

import com.releevante.identity.adapter.persistence.records.SmartLibraryAccessControlRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface SmartLibraryAccessDao
    extends ReactiveCrudRepository<SmartLibraryAccessControlRecord, String> {
  Flux<SmartLibraryAccessControlRecord> findByCredential(String credential);
}
