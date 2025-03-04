package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.SmartLibraryGrantedAccessRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface SmartLibraryGrantedAccessHibernateDao
    extends ReactiveCrudRepository<SmartLibraryGrantedAccessRecord, String> {

  Flux<SmartLibraryGrantedAccessRecord> findAllByAccessId(String accessId);

  @Query("update core.smart_library_granted_access set is_synced = true where slid = :slid")
  Mono<Integer> setSynchronized(@Param("slid") String slid);
}
