package com.main.application.core;

import com.main.application.identity.IdentityServiceFacade;
import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryServiceFacadeImpl implements SmartLibraryServiceFacade {
  private final SmartLibraryService smartLibraryService;

  final IdentityServiceFacade identityServiceFacade;

  public SmartLibraryServiceFacadeImpl(
      SmartLibraryService smartLibraryService, IdentityServiceFacade identityServiceFacade) {
    this.smartLibraryService = smartLibraryService;
    this.identityServiceFacade = identityServiceFacade;
  }

  @Override
  public Mono<SmartLibrary> synchronizeLibraryTransactions(SmartLibrarySyncDto synchronizeDto) {
    return smartLibraryService.synchronizeLibraryTransactions(synchronizeDto);
  }

  @Override
  public Mono<SmartLibrary> synchronizeLibraryTransactionStatus(
      SmartLibrarySyncDto synchronizeDto) {
    return smartLibraryService.synchronizeLibraryTransactionStatus(synchronizeDto);
  }

  @Override
  public Flux<SmartLibraryDto> smartLibrariesValidated(
      AccountPrincipal principal, Set<Slid> sLids) {
    return smartLibraryService.smartLibrariesValidated(principal, sLids);
  }

  @Override
  public Flux<LibrarySetting> getSetting(Slid slid, boolean synced) {
    return smartLibraryService.getSetting(slid, synced);
  }

  @Override
  public Flux<LibrarySetting> getSetting(Slid slid) {
    return smartLibraryService.getSetting(slid);
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return smartLibraryService.setSynchronized(slid);
  }

  @Override
  public Flux<SmartLibraryAccess> getAccesses(Slid slid, boolean synced) {
    return identityServiceFacade.getAccesses(slid, synced);
  }

  @Override
  public Flux<SmartLibraryAccess> getAccesses(Slid slid) {
    return identityServiceFacade.getAccesses(slid);
  }
}
