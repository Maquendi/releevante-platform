package com.releevante.core.application.service;

import com.releevante.core.application.dto.CreateLoanDto;
import com.releevante.core.domain.BookLoanId;
import com.releevante.core.domain.ClientId;
import com.releevante.types.Slid;
import reactor.core.publisher.Mono;

public interface BookLoanService {

  Mono<BookLoanId> createLoan(ClientId clientId, CreateLoanDto dto);

  Mono<BookLoanId> createLoan(Slid slid, ClientId clientId, CreateLoanDto dto);
}
