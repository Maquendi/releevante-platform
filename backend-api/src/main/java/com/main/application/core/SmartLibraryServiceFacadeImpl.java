package com.main.application.core;

import com.main.application.identity.IdentityServiceFacade;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.Slid;
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
  public Flux<LibrarySetting> getSetting(Slid slid, boolean synced) {
    return smartLibraryService.getSetting(slid, synced);
  }

  @Override
  public Flux<LibrarySetting> getSetting(Slid slid) {
    return smartLibraryService.getSetting(slid);
  }

  @Override
  public Mono<Boolean> setBooksSynchronized(Slid slid) {
    return smartLibraryService.setBooksSynchronized(slid);
  }

  @Override
  public Mono<Boolean> setLibrarySettingsSynchronized(Slid slid) {
    return smartLibraryService.setLibrarySettingsSynchronized(slid);
  }

  @Override
  public Mono<Boolean> setAccessSynchronized(Slid slid) {
    return smartLibraryService.setAccessSynchronized(slid);
  }

  @Override
  public Mono<Boolean> setSynchronized(Slid slid) {
    return smartLibraryService.setSynchronized(slid);
  }
}
