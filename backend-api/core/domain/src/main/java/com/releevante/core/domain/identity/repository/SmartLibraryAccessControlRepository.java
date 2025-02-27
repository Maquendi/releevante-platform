package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryAccessControlRepository {
  Flux<SmartLibraryAccess> findAllBy(Slid slid);

  Flux<SmartLibraryAccess> findAllBy(Slid slid, boolean synced);

  Flux<SmartLibraryAccess> findActiveByAccessId(String accessId);

  Flux<SmartLibraryAccess> findActiveByContactLessId(String contactLessId, String orgId);

  Flux<SmartLibraryAccess> findActiveByCredential(String credential, String orgId);

  Flux<SmartLibraryAccess> findActiveByCredential(String credential);

  Flux<SmartLibraryAccess> findActiveBy(String credential, String contactLessId, String orgId);

  Mono<SmartLibraryAccess> save(SmartLibraryAccess access);

  Flux<SmartLibraryAccess> save(List<SmartLibraryAccess> access);
}
