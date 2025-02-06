package com.main.application.core;

import com.releevante.core.application.dto.*;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryServiceFacade {

  Flux<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Set<Slid> sLids);

  Mono<SmartLibrary> synchronizeLibraryTransactions(SmartLibrarySyncDto synchronizeDto);

  Mono<SmartLibrary> synchronizeLibraryTransactionStatus(SmartLibrarySyncDto synchronizeDto);

  Flux<LibrarySetting> getSetting(Slid slid, boolean synced);

  Flux<LibrarySetting> getSetting(Slid slid);

  Mono<Boolean> setSynchronized(Slid slid);

  Flux<SmartLibraryAccess> getAccesses(Slid slid, boolean synced);

  Flux<SmartLibraryAccess> getAccesses(Slid slid);
}
