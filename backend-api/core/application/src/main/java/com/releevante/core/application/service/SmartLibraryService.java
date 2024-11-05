package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookLoanDto;
import com.releevante.core.application.dto.LoanSynchronizeDto;
import com.releevante.core.domain.ClientId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SmartLibraryService {
  Mono<Boolean> synchronize(LoanSynchronizeDto synchronizeDto);

  Flux<BookLoanDto> getBookLoanByClient(ClientId clientId);
}
