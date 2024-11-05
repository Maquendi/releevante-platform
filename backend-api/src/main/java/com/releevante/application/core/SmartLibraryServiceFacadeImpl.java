package com.releevante.application.core;

import com.releevante.core.application.dto.LoanSynchronizeDto;
import com.releevante.core.application.service.SmartLibraryService;
import reactor.core.publisher.Mono;

public class SmartLibraryServiceFacadeImpl implements SmartLibraryServiceFacade {
  private final SmartLibraryService smartLibraryService;

  public SmartLibraryServiceFacadeImpl(SmartLibraryService smartLibraryService) {
    this.smartLibraryService = smartLibraryService;
  }

  @Override
  public Mono<Boolean> synchronize(LoanSynchronizeDto synchronizeDto) {
    return smartLibraryService.synchronize(synchronizeDto);
  }
}
