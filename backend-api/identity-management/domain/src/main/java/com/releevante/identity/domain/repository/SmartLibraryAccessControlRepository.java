package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.*;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryAccessControlRepository {
  Mono<SmartLibraryAccess> findBy(Slid slid);

  Flux<SmartLibraryAccess> findAllBy(Slid slid, boolean synced);

  Flux<SmartLibraryAccess> findBy(AccessCredentialValue credential);

  Mono<SmartLibraryAccess> save(SmartLibraryAccess access);

  Flux<SmartLibraryAccess> save(List<SmartLibraryAccess> access);
}
