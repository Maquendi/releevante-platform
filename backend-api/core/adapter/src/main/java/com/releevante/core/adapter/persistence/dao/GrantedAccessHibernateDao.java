package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.GrantedAccessProjection;
import com.releevante.core.adapter.persistence.records.GrantedAccessRecord;
import java.util.List;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface GrantedAccessHibernateDao
    extends ReactiveCrudRepository<GrantedAccessRecord, String> {

  @Query(
      "select * from core.granted_access ga \n"
          + "inner join core.smart_library_granted_access slga \n"
          + "on slga.access_id = ga.id\n"
          + "where slga.slid in (:slid) "
          + "and slga.is_synced=:isSynced")
  Flux<GrantedAccessProjection> findAllBySlidAndIsSync(List<String> slid, boolean isSynced);

  @Query(
      "select * from core.granted_access ga \n"
          + "inner join core.smart_library_granted_access slga \n"
          + "on slga.access_id = ga.id\n"
          + "where slga.slid in (:slid)")
  Flux<GrantedAccessProjection> findAllBySlid(List<String> slid);

  @Query(
      "SELECT * FROM core.granted_access ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.credential=:credential "
          + "OR ctrl.contact_less_id=:contactLess ")
  Mono<GrantedAccessRecord> findByCredentialOrContactLessIdAndIsActiveTrue(
      String credential, String contactLess);

  @Query("SELECT * FROM core.granted_access ctrl WHERE ctrl.is_active=true AND ctrl.id=:accessId")
  Mono<GrantedAccessRecord> findAllByAccessIdAndIsActiveTrue(String accessId);

  @Query(
      "SELECT * FROM core.granted_access ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.credential=:credential")
  Mono<GrantedAccessRecord> findAllActiveByCredential(String credential);

  @Query(
      "SELECT * FROM core.granted_access ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.contact_less_id=:contactless ")
  Mono<GrantedAccessRecord> findAllActiveByContactLessId(String contactless);

  @Query(
      "SELECT * FROM core.granted_access ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.credential=:credential "
          + "AND ctrl.contact_less_id=:contactLess ")
  Mono<GrantedAccessRecord> findAllActiveBy(String credential, String contactLess);

  @Query(
      "SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.credential=:credential "
          + "OR ctrl.contact_less_id=:contactLess ")
  Mono<GrantedAccessRecord> findAllByCredentialOrContactLessIdAndIsActiveTrue(
      String credential, String contactLess);
}
