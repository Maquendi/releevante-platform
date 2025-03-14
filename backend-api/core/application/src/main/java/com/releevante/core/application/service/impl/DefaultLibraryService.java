package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.sl.SmartLibraryDto;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.*;
import com.releevante.types.exceptions.InvalidInputException;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultLibraryService implements SmartLibraryService {
  final SmartLibraryRepository smartLibraryRepository;
  final AuthorizationService authorizationService;

  public DefaultLibraryService(
      SmartLibraryRepository smartLibraryRepository, AuthorizationService authorizationService) {
    this.smartLibraryRepository = smartLibraryRepository;
    this.authorizationService = authorizationService;
  }

  @Override
  public Mono<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Slid sLid) {
    return smartLibraryRepository
        .findBy(sLid)
        .map(
            smartLibrary -> {
              smartLibrary.validateCanAccess(principal);
              return SmartLibraryDto.from(smartLibrary);
            })
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

  @Override
  public Mono<Boolean> setBooksSynchronized(Slid slid) {
    return smartLibraryRepository.setBooksSynchronized(slid);
  }

  @Override
  public Mono<Boolean> setLibrarySettingsSynchronized(Slid slid) {
    return smartLibraryRepository.setLibrarySettingsSynchronized(slid);
  }

  @Override
  public Mono<Boolean> setAccessSynchronized(Slid slid) {
    return smartLibraryRepository.setAccessSynchronized(slid);
  }
}
