/* (C)2024 */
package com.releevante.identity.application.service.user;

import static com.releevante.types.utils.DateTimeUtils.daysDifference;

import com.releevante.identity.application.dto.*;
import com.releevante.identity.application.service.auth.AuthConstants;
import com.releevante.identity.application.service.auth.AuthorizationService;
import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.AccountRepository;
import com.releevante.identity.domain.repository.SmartLibraryAccessControlRepository;
import com.releevante.identity.domain.repository.UserRepository;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.ZonedDateTimeGenerator;
import com.releevante.types.utils.DateTimeUtils;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultUserServiceImpl extends AccountService implements UserService {
  final UserRepository userRepository;
  final AuthorizationService authorizationService;
  final SmartLibraryAccessControlRepository accessControlRepository;

  public DefaultUserServiceImpl(
      UserRepository userRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      AuthorizationService authorizationService,
      SmartLibraryAccessControlRepository accessControlRepository) {
    super(accountRepository, passwordEncoder, uuidGenerator, dateTimeGenerator);
    this.userRepository = userRepository;
    this.authorizationService = authorizationService;
    this.accessControlRepository = accessControlRepository;
  }

  @Override
  public Mono<UserIdDto> createUser(UserDto userDto) {

    return null;
  }

  @Override
  public Mono<AccountIdDto> createAccount(AccountDto accountDto) {
    return authorizationService
        .checkAuthorities(AuthConstants.ACCOUNT_CREATE)
        .flatMap(principal -> createAccount(accountDto, OrgId.of(principal.orgId())))
        .flatMap(accountRepository::upsert)
        .map(LoginAccount::accountId)
        .map(AccountId::value)
        .map(AccountIdDto::of);
  }

  protected Mono<SmartLibraryGrantedAccess> create(
      List<String> sLids,
      ZonedDateTime expiresAt,
      Integer accessDueDays,
      AccessCredential credentials,
      String userId) {

    return authorizationService
        .checkAuthorities(AuthConstants.LIBRARY_ACCESS_CREATE)
        .flatMap(
            principal ->
                Flux.fromIterable(sLids)
                    .map(
                        slid ->
                            SmartLibraryAccess.builder()
                                .id(uuidGenerator.next())
                                .credential(credentials)
                                .orgId(OrgId.of(principal.orgId()))
                                .createdAt(dateTimeGenerator.next())
                                .updatedAt(dateTimeGenerator.next())
                                .userId(userId)
                                .slid(slid)
                                .isActive(true)
                                .expiresAt(expiresAt)
                                .isSync(false)
                                .accessDueDays(accessDueDays)
                                .build())
                    .collectList()
                    .flatMapMany(accessControlRepository::save)
                    .map(GrantedAccess::from)
                    .collectList()
                    .map(
                        grantedAccesses ->
                            SmartLibraryGrantedAccess.builder()
                                .access(grantedAccesses)
                                .clientId(userId)
                                .build()));
  }

  @Override
  public Mono<SmartLibraryGrantedAccess> create(UserAccessDto access) {
    return Mono.fromCallable(() -> AccessCredential.from(access.key(), access.value()))
        .flatMap(this::validateCredentials)
        .flatMap(
            credential -> {
              var now = ZonedDateTimeGenerator.instance().next();
              var accessDueDays =
                  access
                      .expiresAt()
                      .map(expiresAt -> daysDifference(now, expiresAt))
                      .orElseGet(() -> access.accessDueDays().orElseThrow());
              var expiresAt =
                  access
                      .accessDueDays()
                      .map(DateTimeUtils::daysToAdd)
                      .orElseGet(() -> access.expiresAt().orElseThrow());

              var userId = uuidGenerator.next();

              return create(access.sLids(), expiresAt, accessDueDays, credential, userId);
            });
  }

  @Override
  public Flux<SmartLibraryGrantedAccess> getUnSyncedAccesses(Slid slid) {
    return this.accessControlRepository
        .findAllBy(slid)
        .groupBy(SmartLibraryAccess::userId)
        .flatMap(
            groupedFlux ->
                groupedFlux
                    .collectList()
                    .map(
                        accesses ->
                            SmartLibraryGrantedAccess.builder()
                                .access(
                                    accesses.stream()
                                        .map(GrantedAccess::from)
                                        .collect(Collectors.toList()))
                                .clientId(groupedFlux.key())
                                .build()));
  }

  Mono<AccessCredential> validateCredentials(AccessCredential credential) {
    return accessControlRepository
        .findBy(credential.value())
        .map(
            access -> {
              if (access.isActive()) throw new RuntimeException("access is still active");
              return credential;
            })
        .then(Mono.just(credential));
  }
}
