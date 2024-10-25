package com.releevante.identity.adapter.out.persistence.repository;

import com.releevante.identity.adapter.out.persistence.records.SmartLibraryAccessControlRecord;
import com.releevante.identity.adapter.out.persistence.repository.components.SmartLibraryAccessControlDao;
import com.releevante.identity.domain.model.AccessCode;
import com.releevante.identity.domain.model.NfcUid;
import com.releevante.identity.domain.model.Slid;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.identity.domain.repository.SmartLibraryAccessControlRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryAccessControlRepositoryImpl
    implements SmartLibraryAccessControlRepository {

  final SmartLibraryAccessControlDao libraryAccessControlDao;

  public SmartLibraryAccessControlRepositoryImpl(
      SmartLibraryAccessControlDao libraryAccessControlDao) {
    this.libraryAccessControlDao = libraryAccessControlDao;
  }

  @Override
  public Mono<SmartLibraryAccess> findBy(Slid slid) {
    return Mono.justOrEmpty(libraryAccessControlDao.findById(slid.value()))
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findBy(AccessCode accessCode) {
    return Mono.justOrEmpty(libraryAccessControlDao.findByAccessCode(accessCode.value()))
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Mono<SmartLibraryAccess> findBy(NfcUid nfcUid) {
    return Mono.justOrEmpty(libraryAccessControlDao.findByNfcHash(nfcUid.value()))
        .map(SmartLibraryAccessControlRecord::toDomain);
  }
}
