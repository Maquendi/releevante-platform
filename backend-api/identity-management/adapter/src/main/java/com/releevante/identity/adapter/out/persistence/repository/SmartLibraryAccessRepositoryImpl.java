package com.releevante.identity.adapter.out.persistence.repository;

import com.releevante.identity.adapter.out.persistence.records.SmartLibraryAccessRecord;
import com.releevante.identity.adapter.out.persistence.repository.components.SmartLibraryAccessDao;
import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.SmartLibraryAccessControlRepository;
import com.releevante.types.Slid;
import java.util.List;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryAccessRepositoryImpl implements SmartLibraryAccessControlRepository {

  final SmartLibraryAccessDao libraryAccessControlDao;

  public SmartLibraryAccessRepositoryImpl(SmartLibraryAccessDao libraryAccessControlDao) {
    this.libraryAccessControlDao = libraryAccessControlDao;
  }

  @Override
  public Mono<SmartLibraryAccess> findBy(Slid slid) {
    return Mono.justOrEmpty(libraryAccessControlDao.findById(slid.value()))
        .map(SmartLibraryAccessRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findBy(AccessCredentialValue credential) {
    return Mono.justOrEmpty(libraryAccessControlDao.findByCredential(credential.value()))
        .map(SmartLibraryAccessRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> upsert(SmartLibraryAccess access) {
    return Mono.just(SmartLibraryAccessRecord.fromDomain(access))
        .map(libraryAccessControlDao::save)
        .thenReturn(access);
  }

  @Override
  public Mono<List<SmartLibraryAccess>> upsert(List<SmartLibraryAccess> access) {
    return null;
  }
}
