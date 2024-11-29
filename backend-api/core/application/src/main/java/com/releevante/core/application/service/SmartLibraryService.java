package com.releevante.core.application.service;

import com.releevante.core.application.dto.*;
import com.releevante.core.domain.BookCopy;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Mono<SmartLibrary> synchronizeClients(SmartLibrarySyncDto syncDto);

  Flux<BookLoanDto> getBookLoanByClient(ClientId clientId);

  Flux<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Set<Slid> sLids);

  Flux<SmartLibraryDto> findAll(Set<Slid> sLids);

  Flux<BookCopy> synchronizeLibraryBooks(Slid slid, boolean synced, int offset, int pageSize);

  Flux<LibrarySettingsDto> synchronizeLibrarySettings(Slid slid, boolean synced);

  Mono<Boolean> setSynchronized(Slid slid);
}
