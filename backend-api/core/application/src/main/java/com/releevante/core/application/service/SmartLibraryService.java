package com.releevante.core.application.service;

import com.releevante.core.application.dto.sl.SmartLibraryDto;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Mono<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Slid sLid);

  Flux<SmartLibraryDto> findAll(Set<Slid> sLids);

  Flux<LibrarySetting> getSetting(Slid slid, boolean synced);

  Flux<LibrarySetting> getSetting(Slid slid);

  Mono<Boolean> setSynchronized(Slid slid);

  Mono<Boolean> setBooksSynchronized(Slid slid);

  Mono<Boolean> setLibrarySettingsSynchronized(Slid slid);

  Mono<Boolean> setAccessSynchronized(Slid slid);
}
