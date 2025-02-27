package com.releevante.core.application.identity.service.user;

import com.releevante.core.application.dto.clients.reservations.ReservationDto;
import com.releevante.core.application.dto.clients.transactions.TransactionDto;
import com.releevante.core.application.identity.dto.AccountIdDto;
import com.releevante.core.application.identity.dto.OrgDto;
import com.releevante.core.application.identity.service.auth.AuthConstants;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.domain.identity.model.AccountId;
import com.releevante.core.domain.identity.model.LoginAccount;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.identity.model.Organization;
import com.releevante.core.domain.identity.repository.AccountRepository;
import com.releevante.core.domain.identity.repository.OrgRepository;
import com.releevante.core.domain.identity.service.PasswordEncoder;
import com.releevante.core.domain.repository.BookReservationRepository;
import com.releevante.core.domain.repository.BookTransactionRepository;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class OrgServiceImpl extends AccountService implements OrgService {
  final OrgRepository orgRepository;
  final AuthorizationService authorizationService;
  final BookTransactionRepository bookTransactionRepository;
  final BookReservationRepository bookReservationRepository;

  public OrgServiceImpl(
      OrgRepository orgRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      AuthorizationService authorizationService,
      BookTransactionRepository bookTransactionRepository,
      BookReservationRepository bookReservationRepository) {
    super(accountRepository, passwordEncoder, uuidGenerator, dateTimeGenerator);
    this.orgRepository = orgRepository;
    this.authorizationService = authorizationService;
    this.bookTransactionRepository = bookTransactionRepository;
    this.bookReservationRepository = bookReservationRepository;
  }

  @Override
  public Mono<AccountIdDto> createOrg(OrgDto orgDto) {
    return authorizationService
        .checkAuthorities(AuthConstants.ORG_CREATE)
        .flatMap(
            principal -> {
              var orgId = OrgId.of(uuidGenerator.next());
              var currentDateTime = dateTimeGenerator.next();
              var accountDto = orgDto.account();
              var orgBuilder =
                  Mono.just(
                      Organization.builder()
                          .id(orgId)
                          .createdAt(currentDateTime)
                          .updatedAt(currentDateTime)
                          .isActive(false)
                          .name(orgDto.name())
                          .type(orgDto.type())
                          .build());

              return createAccount(accountDto, orgId)
                  .zipWith(orgBuilder)
                  .flatMap(
                      data -> {
                        var account = data.getT1();
                        var organization = data.getT2();
                        return orgRepository
                            .upsert(organization)
                            .flatMap(org -> accountRepository.upsert(account));
                      });
            })
        .map(LoginAccount::accountId)
        .map(AccountId::value)
        .map(AccountIdDto::of);
  }

  @Override
  public Flux<ReservationDto> getReservations() {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(
            principal ->
                bookReservationRepository
                    .findAll(OrgId.of(principal.orgId()))
                    .map(ReservationDto::from));
  }

  @Override
  public Flux<ReservationDto> getReservations(OrgId orgId) {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(
            principal -> {
              if (principal.isSuperAdmin()) {
                return bookReservationRepository.findAll(orgId).map(ReservationDto::from);
              }
              return bookReservationRepository
                  .findAll(OrgId.of(principal.orgId()))
                  .map(ReservationDto::from);
            });
  }

  @Override
  public Flux<TransactionDto> getTransactions() {
    return authorizationService
        .getAccountPrincipal()
        .flatMapMany(
            principal ->
                bookTransactionRepository
                    .findAll(OrgId.of(principal.orgId()))
                    .map(TransactionDto::from));
  }

  @Override
  public Flux<TransactionDto> getTransactions(OrgId orgId) {
    return bookTransactionRepository.findAll(orgId).map(TransactionDto::from);
  }
}
