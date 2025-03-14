package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryAccessControlRepository {
  Flux<SmartLibraryAccess> findAllBy(Slid slid);

  Flux<SmartLibraryAccess> findAllBy(Slid slid, boolean synced);

  Mono<SmartLibraryAccess> findActiveByAccessId(String accessId);

  Mono<SmartLibraryAccess> findActiveByContactLessId(String contactLessId);

  Mono<SmartLibraryAccess> findActiveByCredential(String credential);

  Mono<SmartLibraryAccess> findActiveBy(String credential, String contactLessId);

  Mono<SmartLibraryAccess> findActiveWithRelations(String credential, String contactLessId);

  Mono<SmartLibraryAccess> save(SmartLibraryAccess access);
}
