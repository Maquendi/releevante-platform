package com.releevante.core.application.service;

import com.releevante.core.application.dto.*;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Mono<SmartLibrary> synchronizeLibraryTransactions(SmartLibrarySyncDto syncDto);

  Mono<SmartLibrary> synchronizeLibraryTransactionStatus(SmartLibrarySyncDto synchronizeDto);

  Flux<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Set<Slid> sLids);

  Flux<SmartLibraryDto> findAll(Set<Slid> sLids);

  Flux<LibrarySetting> getSetting(Slid slid, boolean synced);

  Flux<LibrarySetting> getSetting(Slid slid);

  Mono<Boolean> setSynchronized(Slid slid);
}
