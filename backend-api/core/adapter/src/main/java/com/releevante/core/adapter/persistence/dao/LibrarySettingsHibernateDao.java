package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.LibrarySettingsRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface LibrarySettingsHibernateDao
    extends ReactiveCrudRepository<LibrarySettingsRecord, String> {
  @Query(
      "select * from core.library_settings ls \n"
          + "where ls.slid=:slid\n"
          + "and ls.is_sync=:synced\n"
          + "order by ls.created_at desc\n"
          + "limit 1;")
  Mono<LibrarySettingsRecord> findBy(@Param("slid") String slid, @Param("synced") boolean synced);

  @Query("update core.library_settings set is_sync = true where slid = :slid")
  Mono<Integer> setSynchronized(@Param("slid") String slid);
}
