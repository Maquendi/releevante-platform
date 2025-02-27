package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.SmartLibraryAccessControlRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface SmartLibraryAccessDao
    extends ReactiveCrudRepository<SmartLibraryAccessControlRecord, String> {
  @Query(
      "SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.is_active=true AND ctrl.access_id=:accessId")
  Flux<SmartLibraryAccessControlRecord> findAllByAccessIdAndIsActiveTrue(String accessId);

  @Query(
      "SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.is_synced=:isSynced AND ctrl.slid=:slid")
  Flux<SmartLibraryAccessControlRecord> findAllBySlidAndIsSync(String slid, boolean isSynced);

  @Query("SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.slid=:slid")
  Flux<SmartLibraryAccessControlRecord> findAllBySlid(String slid);

  @Query(
      "SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.contact_less_id=:contactLess "
          + "AND ctrl.org_id=:orgId")
  Flux<SmartLibraryAccessControlRecord> findAllActiveByCredential(String contactLess, String orgId);

  @Query(
      "SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.credential=:credential")
  Flux<SmartLibraryAccessControlRecord> findAllActiveByCredential(String credential);

  @Query(
      "SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.credential=:credential "
          + "AND ctrl.org_id=:orgId")
  Flux<SmartLibraryAccessControlRecord> findAllActiveByContactLessId(
      String credential, String orgId);

  @Query(
      "SELECT * FROM core.smart_library_access_ctrl ctrl WHERE ctrl.is_active=true "
          + "AND ctrl.credential=:credential "
          + "AND ctrl.contact_less_id=:contactLess "
          + "AND ctrl.org_id=:orgId")
  Flux<SmartLibraryAccessControlRecord> findAllActiveBy(
      String credential, String contactLess, String orgId);

  Flux<SmartLibraryAccessControlRecord> findAllByCredentialAndContactLessIdAndOrgIdAndIsActiveTrue(
      String credential, String contactLess, String orgId);
}
