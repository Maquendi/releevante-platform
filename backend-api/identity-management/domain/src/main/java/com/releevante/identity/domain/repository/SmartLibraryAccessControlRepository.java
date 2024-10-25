package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.AccessCode;
import com.releevante.identity.domain.model.NfcUid;
import com.releevante.identity.domain.model.Slid;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import java.util.List;
import reactor.core.publisher.Mono;

public interface SmartLibraryAccessControlRepository {
  Mono<SmartLibraryAccess> findBy(Slid slid);

  Mono<SmartLibraryAccess> findBy(AccessCode accessCode);

  Mono<SmartLibraryAccess> findBy(NfcUid nfcUid);

  Mono<SmartLibraryAccess> upsert(SmartLibraryAccess access);

  Mono<List<SmartLibraryAccess>> upsert(List<SmartLibraryAccess> access);
}
