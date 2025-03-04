package com.releevante.core.application.identity.service.user;

import com.releevante.core.application.dto.clients.reservations.ReservationDto;
import com.releevante.core.application.dto.clients.transactions.TransactionDto;
import com.releevante.core.application.identity.dto.AccountIdDto;
import com.releevante.core.application.identity.dto.GrantedAccess;
import com.releevante.core.application.identity.dto.OrgDto;
import com.releevante.core.application.identity.dto.UserAccessDto;
import com.releevante.core.application.identity.service.auth.AuthConstants;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.domain.identity.model.*;
import com.releevante.core.domain.identity.repository.AccountRepository;
import com.releevante.core.domain.identity.repository.AuthorizedOriginRepository;
import com.releevante.core.domain.identity.repository.OrgRepository;
import com.releevante.core.domain.identity.service.PasswordEncoder;
import com.releevante.core.domain.repository.BookReservationRepository;
import com.releevante.core.domain.repository.BookTransactionRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.ForbiddenException;
import java.time.ZonedDateTime;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class OrgServiceImpl extends AccountService implements OrgService {
  final OrgRepository orgRepository;
  final AuthorizationService authorizationService;
  final BookTransactionRepository bookTransactionRepository;
  final BookReservationRepository bookReservationRepository;
  final UserService userService;

  final AuthorizedOriginRepository authorizedOriginRepository;

  public OrgServiceImpl(
      OrgRepository orgRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      AuthorizationService authorizationService,
      BookTransactionRepository bookTransactionRepository,
      BookReservationRepository bookReservationRepository,
      UserService userService,
      AuthorizedOriginRepository authorizedOriginRepository) {
    super(accountRepository, passwordEncoder, uuidGenerator, dateTimeGenerator);
    this.orgRepository = orgRepository;
    this.authorizationService = authorizationService;
    this.bookTransactionRepository = bookTransactionRepository;
    this.bookReservationRepository = bookReservationRepository;
    this.userService = userService;
    this.authorizedOriginRepository = authorizedOriginRepository;
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

  private Mono<GrantedAccess> doCreate(OrgId orgId, UserAccessDto access) {
    return authorizedOriginRepository
        .findById(orgId)
        .filter(AuthorizedOrigin::isSmartLibrary)
        .switchIfEmpty(Mono.error(new ForbiddenException()))
        .map(AuthorizedOrigin::id)
        .map(Slid::of)
        .collectList()
        .flatMap(slid -> userService.create(slid, orgId, access));
  }

  @Override
  public Mono<GrantedAccess> create(OrgId orgId, UserAccessDto access) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal -> {
              if (principal.isAdmin()) {
                return doCreate(OrgId.of(principal.orgId()), access);
              }
              return doCreate(orgId, access);
            });
  }
}
