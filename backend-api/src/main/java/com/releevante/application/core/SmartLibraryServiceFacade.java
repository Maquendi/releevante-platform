package com.releevante.application.core;

import com.releevante.core.application.dto.LoanSynchronizeDto;
import reactor.core.publisher.Mono;

public interface SmartLibraryServiceFacade {
  Mono<Boolean> synchronize(LoanSynchronizeDto synchronizeDto);
}
