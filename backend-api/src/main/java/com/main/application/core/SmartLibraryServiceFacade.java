package com.main.application.core;

import com.releevante.core.application.dto.*;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryServiceFacade {

  Flux<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Set<Slid> sLids);

  Mono<LibrarySyncResponse> synchronizeClients(SmartLibrarySyncDto synchronizeDto);

  Mono<LibrarySyncResponse> synchronizeLibraryBooks(Slid slid, int offset, int pageSize);

  Mono<LibrarySyncResponse> synchronizeLibrarySettings(Slid slid);

  Mono<Boolean> setSynchronized(Slid slid);

  Mono<LibrarySyncResponse> synchronizeLibraryAccesses(Slid slid);
}
