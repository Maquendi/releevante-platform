package com.main.application.core;

import com.releevante.core.application.dto.*;
import com.releevante.core.domain.BookCopy;
import com.releevante.identity.application.dto.GrantedAccess;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.List;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryServiceFacade {

  Flux<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Set<Slid> sLids);

  Mono<List<ClientSyncResponse>> synchronizeClients(SmartLibrarySyncDto synchronizeDto);

  Flux<BookCopy> synchronizeLibraryBooks(Slid slid, boolean synced, int offset, int pageSize);

  Flux<LibrarySettingsDto> synchronizeLibrarySettings(Slid slid, boolean synced);

  Mono<Boolean> setSynchronized(Slid slid);

  Flux<GrantedAccess> synchronizeLibraryAccesses(Slid slid, boolean synced);
}
