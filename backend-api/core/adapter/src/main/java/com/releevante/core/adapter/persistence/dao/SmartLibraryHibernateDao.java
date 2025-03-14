package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.SmartLibraryProjection;
import com.releevante.core.adapter.persistence.records.SmartLibraryRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface SmartLibraryHibernateDao
    extends ReactiveCrudRepository<SmartLibraryRecord, String> {

  @Query(
      "with library_status as (\n"
          + "select\n"
          + "\tle.type as status,\n"
          + "\tle.slid\n"
          + "from\n"
          + "\tcore.library_events le\n"
          + "where\n"
          + "\tle.slid = :slid\n"
          + "order by\n"
          + "\tle.created_at desc\n"
          + "limit 1\n"
          + ")\n"
          + "select\n"
          + "\tsl.slid,\n"
          + "\tsl.model_name,\n"
          + "\tsl.created_at,\n"
          + "\tao.org_id,\n"
          + "\tao.is_active,\n"
          + "\tsl.modules,\n"
          + "\tsl.module_capacity,\n"
          + "\tls.status\n"
          + "from\n"
          + "\tcore.authorized_origins ao\n"
          + "inner join core.smart_libraries sl  \n"
          + "on\n"
          + "\tsl.slid = ao.id\n"
          + "inner join library_status ls\n"
          + "on\n"
          + "\tls.slid = sl.slid\n"
          + "where\n"
          + "\tsl.slid = :slid;")
  Mono<SmartLibraryProjection> findOneBy(@Param("slid") String slid);
}
