package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.AccountAuthorizationService;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.*;
import com.releevante.types.exceptions.InvalidInputException;
import java.time.ZonedDateTime;
import java.util.Set;
import java.util.function.Predicate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultLibraryService implements SmartLibraryService {
  final SmartLibraryRepository smartLibraryRepository;
  final AccountAuthorizationService accountAuthorizationService;
  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public DefaultLibraryService(
      SmartLibraryRepository smartLibraryRepository,
      AccountAuthorizationService accountAuthorizationService) {
    this.smartLibraryRepository = smartLibraryRepository;
    this.accountAuthorizationService = accountAuthorizationService;
  }

  @Override
  public Mono<SmartLibrary> synchronizeLibraryTransactions(SmartLibrarySyncDto libraryDto) {
    return libraryFrom(libraryDto).flatMap(smartLibraryRepository::synchronizeLibraryTransactions);
  }

  private Mono<SmartLibrary> libraryFrom(SmartLibrarySyncDto libraryDto) {
    return accountAuthorizationService
        .getCurrentPrincipal()
        .flatMap(
            principal ->
                smartLibraryRepository
                    .findBy(Slid.of(principal.audience()))
                    .switchIfEmpty(Mono.error(new InvalidInputException("Smart library not exist")))
                    .map(
                        smartLibrary -> {
                          smartLibrary.validateIsActive();
                          return smartLibrary.withClients(
                              libraryDto.domainClients(
                                  principal, uuidGenerator, dateTimeGenerator));
                        }));
  }

  @Override
  public Mono<SmartLibrary> synchronizeLibraryTransactionStatus(SmartLibrarySyncDto libraryDto) {
    return libraryFrom(libraryDto)
        .flatMap(smartLibraryRepository::synchronizeLibraryTransactionStatus);
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
