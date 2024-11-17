package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookLoanDto;
import com.releevante.core.application.dto.SmartLibraryDto;
import com.releevante.core.application.dto.SmartLibrarySyncDto;
import com.releevante.core.domain.ClientId;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.Set;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Mono<Boolean> synchronize(SmartLibrarySyncDto syncDto);

  Flux<BookLoanDto> getBookLoanByClient(ClientId clientId);

  Flux<SmartLibraryDto> smartLibrariesValidated(AccountPrincipal principal, Set<Slid> sLids);

  Flux<SmartLibraryDto> findAll(Set<Slid> sLids);
}
