package com.main.application.core;

import com.releevante.core.application.dto.SmartLibraryDto;
import com.releevante.core.application.dto.SmartLibrarySyncDto;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryServiceFacade {
  Mono<Boolean> synchronize(SmartLibrarySyncDto synchronizeDto);

  Flux<SmartLibraryDto> validateAccess(AccountPrincipal principal, List<Slid> sLids);
}
