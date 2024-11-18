package com.releevante.identity.adapter.persistence.repository;

import com.releevante.identity.adapter.persistence.records.SmartLibraryAccessControlRecord;
import com.releevante.identity.adapter.persistence.repository.components.SmartLibraryAccessDao;
import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.SmartLibraryAccessControlRepository;
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
  public Mono<SmartLibraryAccess> findBy(Slid slid) {
    return libraryAccessControlDao
        .findById(slid.value())
        .map(SmartLibraryAccessControlRecord::toDomain);
  }

  @Override
  public Flux<SmartLibraryAccess> findBy(AccessCredentialValue credential) {
    return libraryAccessControlDao
        .findByCredential(credential.value())
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
