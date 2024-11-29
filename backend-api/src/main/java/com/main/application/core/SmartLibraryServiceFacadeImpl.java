package com.main.application.core;

import com.main.application.identity.IdentityServiceFacade;
import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.BookCopy;
import com.releevante.identity.application.dto.GrantedAccess;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.List;
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
  public Mono<List<ClientSyncResponse>> synchronizeClients(SmartLibrarySyncDto synchronizeDto) {
    return smartLibraryService.synchronizeClients(synchronizeDto).map(ClientSyncResponse::from);
  }

  @Override
  public Flux<SmartLibraryDto> smartLibrariesValidated(
      AccountPrincipal principal, Set<Slid> sLids) {
    return smartLibraryService.smartLibrariesValidated(principal, sLids);
  }

  @Override
  public Flux<BookCopy> synchronizeLibraryBooks(
      Slid slid, boolean synced, int offset, int pageSize) {
    return smartLibraryService.synchronizeLibraryBooks(slid, synced, offset, pageSize);
  }

  @Override
  public Flux<LibrarySettingsDto> synchronizeLibrarySettings(Slid slid, boolean synced) {
    return smartLibraryService.synchronizeLibrarySettings(slid, synced);
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return smartLibraryService.setSynchronized(slid);
  }

  @Override
  public Flux<GrantedAccess> synchronizeLibraryAccesses(Slid slid, boolean synced) {
    return identityServiceFacade.getUnSyncedAccesses(slid, synced);
  }
}
