package com.releevante.core.domain.repository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryInventoryRepository {

  Flux<Void> updateLibraryInventory();

  Mono<Void> updateLibraryInventories();
}
