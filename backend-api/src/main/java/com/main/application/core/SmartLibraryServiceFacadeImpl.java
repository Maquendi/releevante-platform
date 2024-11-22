package com.main.application.core;

import com.main.application.identity.IdentityServiceFacade;
import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import java.util.stream.Collectors;
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
  public Mono<LibrarySyncResponse> synchronizeClients(SmartLibrarySyncDto synchronizeDto) {
    return smartLibraryService.synchronizeClients(synchronizeDto);
  }

  @Override
  public Flux<SmartLibraryDto> smartLibrariesValidated(
      AccountPrincipal principal, Set<Slid> sLids) {
    return smartLibraryService.smartLibrariesValidated(principal, sLids);
  }

  @Override
  public Mono<LibrarySyncResponse> synchronizeLibraryBooks(Slid slid, int offset, int pageSize) {
    return smartLibraryService.synchronizeLibraryBooks(slid, offset, pageSize);
  }

  @Override
  public Mono<LibrarySyncResponse> synchronizeLibrarySettings(Slid slid) {
    return smartLibraryService.synchronizeLibrarySettings(slid);
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return smartLibraryService.setSynchronized(slid);
  }

  @Override
  public Mono<LibrarySyncResponse> synchronizeLibraryAccesses(Slid slid) {
    return identityServiceFacade
        .getUnSyncedAccesses(slid)
        .map(
            grantedAccess ->
                LibraryAccessDto.builder()
                    .clientId(grantedAccess.clientId())
                    .accesses(
                        grantedAccess.access().stream()
                            .map(
                                access ->
                                    AccessDto.builder()
                                        .accessId(access.accessId())
                                        .accessDueDays(access.accessDueDays())
                                        .expiresAt(access.expiresAt())
                                        .build())
                            .collect(Collectors.toList()))
                    .build())
        .collectList()
        .map(LibrarySyncResponse::fromAccess);
  }
}
