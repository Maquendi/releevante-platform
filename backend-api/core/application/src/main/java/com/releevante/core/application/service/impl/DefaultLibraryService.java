package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.InvalidInputException;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultLibraryService implements SmartLibraryService {
  private final SmartLibraryRepository smartLibraryRepository;

  public DefaultLibraryService(SmartLibraryRepository smartLibraryRepository) {
    this.smartLibraryRepository = smartLibraryRepository;
  }

  @Override
  public Mono<LibrarySyncResponse> synchronizeClients(SmartLibrarySyncDto syncDto) {
    return smartLibraryRepository
        .findBy(Slid.of(syncDto.slid()))
        .flatMap(
            smartLibrary -> {
              smartLibrary.validateIsActive();
              var clients = syncDto.domainClients();
              return smartLibraryRepository
                  .synchronizeClients(smartLibrary.withClients(clients))
                  .map(ClientSyncResponse::fromDomain);
            });
  }

  @Override
  public Flux<BookLoanDto> getBookLoanByClient(ClientId clientId) {
    return null;
  }

  @Override
  public Flux<SmartLibraryDto> smartLibrariesValidated(
      AccountPrincipal principal, Set<Slid> sLids) {

    return Mono.just(sLids)
        .filter(Predicate.not(Set::isEmpty))
        .switchIfEmpty(Mono.error(new InvalidInputException("no slid")))
        .flatMapMany(
            slidSet ->
                smartLibraryRepository
                    .findById(slidSet)
                    .map(
                        smartLibrary -> {
                          smartLibrary.validateCanAccess(principal);
                          return SmartLibraryDto.from(smartLibrary);
                        }))
        .switchIfEmpty(Mono.error(new InvalidInputException("no slid with provided input")));
  }

  @Override
  public Flux<SmartLibraryDto> findAll(Set<Slid> sLids) {
    return smartLibraryRepository.findById(sLids).map(SmartLibraryDto::from);
  }

  @Override
  public Mono<LibrarySyncResponse> synchronizeLibraryBooks(Slid slid, int offset, int pageSize) {
    return smartLibraryRepository
        .findAllBookCopiesUnSynced(slid, offset, pageSize)
        .map(BookCopyDto::from)
        .collectList()
        .filter(Predicate.not(List::isEmpty))
        .flatMap(
            bookCopies -> {
              var bookIsbnSet =
                  bookCopies.stream()
                      .map(BookCopyDto::isbn)
                      .map(Isbn::of)
                      .collect(Collectors.toSet());

              return smartLibraryRepository
                  .getImages(bookIsbnSet)
                  .map(BookImageDto::from)
                  .collectList()
                  .map(bookImages -> LibrarySyncResponse.from(bookCopies, bookImages));
            })
        .defaultIfEmpty(LibrarySyncResponse.fromEmpty());
  }

  @Override
  public Mono<LibrarySyncResponse> synchronizeLibrarySettings(Slid slid) {
    return smartLibraryRepository
        .findLibrarySettings(slid)
        .map(LibrarySettingsDto::from)
        .collectList()
        .map(LibrarySyncResponse::fromSettings);
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return smartLibraryRepository.setSynchronized(slid);
  }
}
