package com.releevante.core.application.service;

import com.releevante.core.application.dto.*;
import com.releevante.core.domain.ClientId;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Mono<LibrarySyncResponse> synchronizeClients(SmartLibrarySyncDto syncDto);

  Flux<BookLoanDto> getBookLoanByClient(ClientId clientId);

  Flux<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Set<Slid> sLids);

  Flux<SmartLibraryDto> findAll(Set<Slid> sLids);

  Mono<LibrarySyncResponse> synchronizeLibraryBooks(Slid slid, int offset, int pageSize);

  Mono<LibrarySyncResponse> synchronizeLibrarySettings(Slid slid);

  Mono<Boolean> setSynchronized(Slid slid);
}
