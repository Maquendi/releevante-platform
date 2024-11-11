package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookLoanDto;
import com.releevante.core.application.dto.LoanSynchronizeDto;
import com.releevante.core.application.dto.SmartLibraryDto;
import com.releevante.core.domain.ClientId;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Mono<Boolean> synchronize(LoanSynchronizeDto synchronizeDto);

  Flux<BookLoanDto> getBookLoanByClient(ClientId clientId);

  Flux<SmartLibraryDto> validateAccess(AccountPrincipal principal, List<Slid> sLids);
}
