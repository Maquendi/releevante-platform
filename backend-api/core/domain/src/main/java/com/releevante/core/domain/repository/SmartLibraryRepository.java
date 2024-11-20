package com.releevante.core.domain.repository;

import com.releevante.core.domain.*;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryRepository {
  Flux<SmartLibrary> findById(Set<Slid> sLids);

  Mono<SmartLibrary> saveEvent(SmartLibrary smartLibrary);

  Mono<SmartLibrary> findBy(Slid slid);

  Mono<SmartLibrary> synchronizeClients(SmartLibrary smartLibrary);

  Flux<BookCopy> synchronizeBooks(Slid slid, int offset, int pageSize);

  Flux<LibrarySetting> synchronizeSetting(Slid slid);

  Flux<BookImage> getImages(Set<Isbn> isbnSet);
}
