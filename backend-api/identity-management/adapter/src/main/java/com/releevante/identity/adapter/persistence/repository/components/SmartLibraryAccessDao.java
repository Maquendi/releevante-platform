package com.releevante.identity.adapter.persistence.repository.components;

import com.releevante.identity.adapter.persistence.records.SmartLibraryAccessRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface SmartLibraryAccessDao
    extends ReactiveCrudRepository<SmartLibraryAccessRecord, String> {
  Mono<SmartLibraryAccessRecord> findByCredential(String credential);
}
