package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.LibrarySettingsRecord;
import com.releevante.core.domain.LibrarySetting;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface LibrarySettingsHibernateDao
    extends ReactiveCrudRepository<LibrarySettingsRecord, String> {
  @Query(
      "select * from core.library_settings ls \n"
          + "where ls.slid=:slid\n"
          + "and ls.is_synced=:synced\n"
          + "order by ls.created_at desc\n")
  Flux<LibrarySettingsRecord> findBy(@Param("slid") String slid, @Param("synced") boolean synced);

  @Query(
      "select * from core.library_settings ls \n"
          + "where ls.slid=:slid\n"
          + "order by ls.created_at desc\n")
  Flux<LibrarySettingsRecord> findBy(@Param("slid") String slid);

  @Query("update core.library_settings set is_synced = true where slid = :slid")
  Mono<Integer> setSynchronized(@Param("slid") String slid);

  @Query(
      "with data_cte as (\n"
          + "select\n"
          + "\tid as slid\n"
          + "from\n"
          + "\tcore.authorized_origins ao\n"
          + "where\n"
          + "\tao.org_id = :orgId\n"
          + ")\n"
          + "select\n"
          + "\t ls.*\n"
          + "from\n"
          + "\tcore.library_settings ls\n"
          + "inner join data_cte cte \n"
          + "on\n"
          + "\tls.slid = cte.slid")
  Flux<LibrarySetting> findCurrentByOrgId(String orgId);
}
