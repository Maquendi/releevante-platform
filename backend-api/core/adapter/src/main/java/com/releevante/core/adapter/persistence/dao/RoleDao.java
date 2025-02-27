package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.PrivilegeProjection;
import com.releevante.core.adapter.persistence.records.RoleRecord;
import java.util.List;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface RoleDao extends ReactiveCrudRepository<RoleRecord, String> {
  Flux<RoleRecord> findAllByRole(String role);

  Flux<RoleRecord> findByRoleIn(List<String> role);

  @Query("select privilege from core.roles where role in (:roles)")
  Flux<PrivilegeProjection> findAllPrivilegeBy(@Param("roles") List<String> roles);
}
