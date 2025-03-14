package com.main.application.core;

import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryServiceFacade {
  Flux<LibrarySetting> getSetting(Slid slid, boolean synced);

  Flux<LibrarySetting> getSetting(Slid slid);

  Mono<Boolean> setBooksSynchronized(Slid slid);

  Mono<Boolean> setLibrarySettingsSynchronized(Slid slid);

  Mono<Boolean> setAccessSynchronized(Slid slid);

  Mono<Boolean> setSynchronized(Slid slid);
}
