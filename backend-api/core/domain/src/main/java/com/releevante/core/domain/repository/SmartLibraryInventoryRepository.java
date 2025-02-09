package com.releevante.core.domain.repository;

import reactor.core.publisher.Flux;

public interface SmartLibraryInventoryRepository {

  Flux<Void> updateLibraryInventory();
}
