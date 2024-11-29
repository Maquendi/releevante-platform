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

  Flux<BookCopy> findAllBookCopiesUnSynced(Slid slid, boolean synced, int offset, int pageSize);

  Flux<LibrarySetting> findLibrarySettings(Slid slid, boolean synced);

  Flux<BookImage> getImages(Set<Isbn> isbnSet);

  Flux<BookImage> getImages(Isbn isbn);

  Mono<Boolean> setSynchronized(Slid slid);
}
