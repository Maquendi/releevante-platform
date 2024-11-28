package com.main.application.core;

import com.main.application.identity.IdentityServiceFacade;
import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.SmartLibraryService;
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
  public Flux<BookCopyDto> synchronizeLibraryBooks(Slid slid, int offset, int pageSize) {
    return smartLibraryService.synchronizeLibraryBooks(slid, offset, pageSize);
  }

  @Override
  public Flux<LibrarySettingsDto> synchronizeLibrarySettings(Slid slid) {
    return smartLibraryService.synchronizeLibrarySettings(slid);
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return smartLibraryService.setSynchronized(slid);
  }

  @Override
  public Flux<GrantedAccess> synchronizeLibraryAccesses(Slid slid) {
    return identityServiceFacade.getUnSyncedAccesses(slid);
  }
}
