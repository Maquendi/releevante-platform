package com.releevante.core.domain.repository;

import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SettingsRepository {
  Mono<LibrarySetting> create(LibrarySetting setting);

  Mono<LibrarySetting> find(String id);

  Flux<LibrarySetting> create(Slid slid);

  Flux<LibrarySetting> findBy(Slid slid, boolean synced);

  Flux<LibrarySetting> findBy(Slid slid);

  Mono<LibrarySetting> findCurrentBy(Slid slid);

  Mono<Integer> setSynchronized(Slid slid);
}
