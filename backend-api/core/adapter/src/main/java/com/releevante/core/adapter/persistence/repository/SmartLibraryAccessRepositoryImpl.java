package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.SmartLibraryAccessDao;
import com.releevante.core.adapter.persistence.records.SmartLibraryAccessControlRecord;
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

  final SmartLibraryAccessDao libraryAccessControlDao;

  public SmartLibraryAccessRepositoryImpl(SmartLibraryAccessDao libraryAccessControlDao) {
    this.libraryAccessControlDao = libraryAccessControlDao;
  }

  @Override
  public Flux<SmartLibraryAccess> findAllBy(Slid slid) {
    return libraryAccessControlDao
        .findAllBySlid(slid.value())
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findAllBy(Slid slid, boolean synced) {
    return libraryAccessControlDao
        .findAllBySlidAndIsSync(slid.value(), synced)
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findActiveByAccessId(String accessId) {
    return libraryAccessControlDao
        .findAllByAccessIdAndIsActiveTrue(accessId)
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findActiveByContactLessId(String contactLessId, String orgId) {
    return libraryAccessControlDao
        .findAllActiveByContactLessId(contactLessId, orgId)
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findActiveByCredential(String credential, String orgId) {
    return libraryAccessControlDao
        .findAllActiveByCredential(credential, orgId)
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findActiveByCredential(String credential) {
    return libraryAccessControlDao
        .findAllActiveByCredential(credential)
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findActiveBy(
      String credential, String contactLessId, String orgId) {
    return libraryAccessControlDao
        .findAllByCredentialAndContactLessIdAndOrgIdAndIsActiveTrue(
            credential, contactLessId, orgId)
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> save(SmartLibraryAccess access) {
    return Mono.just(SmartLibraryAccessControlRecord.fromDomain(access))
        .flatMap(libraryAccessControlDao::save)
        .thenReturn(access);
  }

  @Override
  public Flux<SmartLibraryAccess> save(List<SmartLibraryAccess> accesses) {
    return Mono.just(
            accesses.stream()
                .map(SmartLibraryAccessControlRecord::fromDomain)
                .collect(Collectors.toList()))
        .flatMapMany(libraryAccessControlDao::saveAll)
        .thenMany(Flux.fromIterable(accesses));
  }
}
