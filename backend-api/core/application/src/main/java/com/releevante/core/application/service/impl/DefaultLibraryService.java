package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.BookLoanDto;
import com.releevante.core.application.dto.LoanSynchronizeDto;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.types.Slid;
import java.util.stream.Collectors;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultLibraryService implements SmartLibraryService {
  private final BookLoanRepository bookLoanRepository;

  public DefaultLibraryService(BookLoanRepository bookLoanRepository) {
    this.bookLoanRepository = bookLoanRepository;
  }

  @Override
  public Mono<Boolean> synchronize(LoanSynchronizeDto synchronizeDto) {
    return Mono.fromCallable(
            () ->
                synchronizeDto.loans().stream()
                    .map(loanDto -> loanDto.toDomain(Slid.of(synchronizeDto.slid())))
                    .collect(Collectors.toList()))
        .flatMap(bookLoanRepository::upsert);
  }

  @Override
  public Flux<BookLoanDto> getBookLoanByClient(ClientId clientId) {
    return null;
  }
}
