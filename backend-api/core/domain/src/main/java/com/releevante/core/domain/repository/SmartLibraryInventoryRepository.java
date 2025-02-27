package com.releevante.core.domain.repository;

import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryInventoryRepository {

  Flux<Void> updateLibraryInventory();

  Mono<Void> updateLibraryInventories();

  Mono<Void> updateInventoryIsSyncedFalseByIsbn(Set<String> isbnSet);
}
