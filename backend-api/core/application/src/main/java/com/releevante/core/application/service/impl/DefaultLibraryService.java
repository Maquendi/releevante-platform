package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.AccountAuthorizationService;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.InvalidInputException;
import java.util.Set;
import java.util.function.Predicate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultLibraryService implements SmartLibraryService {
  final SmartLibraryRepository smartLibraryRepository;
  final AccountAuthorizationService accountAuthorizationService;

  public DefaultLibraryService(
      SmartLibraryRepository smartLibraryRepository,
      AccountAuthorizationService accountAuthorizationService) {
    this.smartLibraryRepository = smartLibraryRepository;
    this.accountAuthorizationService = accountAuthorizationService;
  }

  @Override
  public Mono<SmartLibrary> synchronizeClientsLoans(SmartLibrarySyncDto syncDto) {
    return accountAuthorizationService
        .getCurrentPrincipal()
        .flatMap(
            principal ->
                smartLibraryRepository
                    .findBy(Slid.of(syncDto.slid()))
                    .switchIfEmpty(Mono.error(new InvalidInputException("Smart library not exist")))
                    .flatMap(
                        smartLibrary -> {
                          smartLibrary.validateIsActive();
                          var clients = syncDto.domainClients(principal);
                          return smartLibraryRepository.synchronizeClientsLoans(
                              smartLibrary.withClients(clients));
                        }));
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
  public Flux<LibrarySetting> getSetting(Slid slid, boolean synced) {
    return smartLibraryRepository.getSetting(slid, synced);
  }

  @Override
  public Flux<LibrarySetting> getSetting(Slid slid) {
    return smartLibraryRepository.getSetting(slid);
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return smartLibraryRepository.setSynchronized(slid);
  }
}
