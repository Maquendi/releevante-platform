package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.*;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryAccessControlRepository {
  Mono<SmartLibraryAccess> findBy(Slid slid);

  Mono<SmartLibraryAccess> findBy(AccessCredentialValue credential);

  Mono<SmartLibraryAccess> upsert(SmartLibraryAccess access);

  Flux<SmartLibraryAccess> upsert(List<SmartLibraryAccess> access);
}
