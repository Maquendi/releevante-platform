package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.GrantedAccessHibernateDao;
import com.releevante.core.adapter.persistence.dao.SmartLibraryGrantedAccessHibernateDao;
import com.releevante.core.adapter.persistence.dao.projections.GrantedAccessProjection;
import com.releevante.core.adapter.persistence.records.GrantedAccessRecord;
import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.core.domain.identity.repository.SmartLibraryAccessControlRepository;
import com.releevante.types.Slid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryAccessRepositoryImpl implements SmartLibraryAccessControlRepository {

  final SmartLibraryGrantedAccessHibernateDao libraryGrantedAccessHibernateDao;
  final GrantedAccessHibernateDao grantedAccessHibernateDao;

  public SmartLibraryAccessRepositoryImpl(
      SmartLibraryGrantedAccessHibernateDao libraryGrantedAccessHibernateDao,
      GrantedAccessHibernateDao grantedAccessHibernateDao) {
    this.libraryGrantedAccessHibernateDao = libraryGrantedAccessHibernateDao;
    this.grantedAccessHibernateDao = grantedAccessHibernateDao;
  }

  @Override
  public Flux<SmartLibraryAccess> findAllBy(Slid slid) {
    return grantedAccessHibernateDao
        .findAllBySlid(List.of(slid.value()))
        .map(GrantedAccessProjection::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findAllBy(Slid slid, boolean synced) {
    return grantedAccessHibernateDao
        .findAllBySlidAndIsSync(List.of(slid.value()), synced)
        .map(GrantedAccessProjection::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findActiveByAccessId(String accessId) {
    return grantedAccessHibernateDao
        .findAllByAccessIdAndIsActiveTrue(accessId)
        .map(GrantedAccessRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findActiveByContactLessId(String contactLessId) {
    return grantedAccessHibernateDao
        .findAllActiveByContactLessId(contactLessId)
        .map(GrantedAccessRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findActiveByCredential(String credential) {
    return grantedAccessHibernateDao
        .findAllActiveByCredential(credential)
        .map(GrantedAccessRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findActiveBy(String credential, String contactLessId) {
    return grantedAccessHibernateDao
        .findByCredentialOrContactLessIdAndIsActiveTrue(credential, contactLessId)
        .map(GrantedAccessRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findActiveWithRelations(String credential, String contactLessId) {
    return grantedAccessHibernateDao
        .findByCredentialOrContactLessIdAndIsActiveTrue(credential, contactLessId)
        .flatMap(
            grantedAccessRecord ->
                libraryGrantedAccessHibernateDao
                    .findAllByAccessId(grantedAccessRecord.getId())
                    .collect(Collectors.toSet())
                    .map(
                        list -> {
                          grantedAccessRecord.setSmartLibraryGrantedAccessRecords(list);
                          return grantedAccessRecord;
                        })
                    .thenReturn(grantedAccessRecord))
        .map(GrantedAccessRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> save(SmartLibraryAccess access) {
    return Mono.just(GrantedAccessRecord.fromDomain(access))
        .flatMap(grantedAccessHibernateDao::save)
        .map(GrantedAccessRecord::getSmartLibraryGrantedAccessRecords)
        .flatMapMany(libraryGrantedAccessHibernateDao::saveAll)
        .collectList()
        .thenReturn(access);
  }
}
