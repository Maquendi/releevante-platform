package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.SmartLibraryAccessControlRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface SmartLibraryAccessControlDao
    extends ReactiveCrudRepository<SmartLibraryAccessControlRecord, String> {
  Flux<SmartLibraryAccessControlRecord> findByCredential(String credential);

  Flux<SmartLibraryAccessControlRecord> findAllBySlidAndIsSyncedIsFalse(String slid);

  @Query("update core.smart_library_access_ctrl set is_synced = true where slid = :slid")
  Mono<Integer> setSynchronized(@Param("slid") String slid);
}
