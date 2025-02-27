package com.releevante.core.application.identity.service.user;

import com.releevante.core.application.dto.clients.reservations.ReservationDto;
import com.releevante.core.application.dto.clients.transactions.TransactionDto;
import com.releevante.core.application.identity.dto.AccountIdDto;
import com.releevante.core.application.identity.dto.OrgDto;
import com.releevante.core.domain.identity.model.OrgId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface OrgService {
  Mono<AccountIdDto> createOrg(OrgDto orgDto);

  Flux<ReservationDto> getReservations();

  Flux<ReservationDto> getReservations(OrgId orgId);

  Flux<TransactionDto> getTransactions();

  Flux<TransactionDto> getTransactions(OrgId orgId);
}
