package com.main.application.core;

import com.releevante.core.application.dto.*;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryServiceFacadeImpl implements SmartLibraryServiceFacade {
  private final SmartLibraryService smartLibraryService;

  public SmartLibraryServiceFacadeImpl(SmartLibraryService smartLibraryService) {
    this.smartLibraryService = smartLibraryService;
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
}
