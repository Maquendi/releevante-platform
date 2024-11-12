package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.BookLoanDto;
import com.releevante.core.application.dto.SmartLibraryDto;
import com.releevante.core.application.dto.SmartLibrarySyncDto;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.core.domain.repository.ClientRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultLibraryService implements SmartLibraryService {
  private final BookLoanRepository bookLoanRepository;
  private final SmartLibraryRepository smartLibraryRepository;
  private final ClientRepository clientRepository;

  public DefaultLibraryService(
      BookLoanRepository bookLoanRepository,
      SmartLibraryRepository smartLibraryRepository,
      ClientRepository clientRepository) {
    this.bookLoanRepository = bookLoanRepository;
    this.smartLibraryRepository = smartLibraryRepository;
    this.clientRepository = clientRepository;
  }

  @Override
  public Mono<Boolean> synchronize(SmartLibrarySyncDto syncDto) {
    return smartLibraryRepository
        .findBy(Slid.of(syncDto.slid()))
        .flatMap(
            smartLibrary -> {
              smartLibrary.validateIsActive();
              return smartLibraryRepository.synchronizeClients(
                  smartLibrary.withClients(syncDto.domainClients()));
            })
        .thenReturn(true);
  }

  @Override
  public Flux<BookLoanDto> getBookLoanByClient(ClientId clientId) {
    return null;
  }

  @Override
  public Flux<SmartLibraryDto> validateAccess(AccountPrincipal principal, List<Slid> sLids) {
    return smartLibraryRepository
        .findById(sLids)
        .map(
            smartLibrary -> {
              smartLibrary.validateCanAccess(principal);
              return SmartLibraryDto.fromDomain(smartLibrary);
            });
  }
}
