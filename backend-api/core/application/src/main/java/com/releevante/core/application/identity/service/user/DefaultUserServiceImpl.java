/* (C)2024 */
package com.releevante.core.application.identity.service.user;

import com.releevante.core.application.identity.dto.*;
import com.releevante.core.application.identity.service.auth.AuthConstants;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.core.domain.identity.model.*;
import com.releevante.core.domain.identity.repository.AccountRepository;
import com.releevante.core.domain.identity.repository.SmartLibraryAccessControlRepository;
import com.releevante.core.domain.identity.repository.UserRepository;
import com.releevante.core.domain.identity.service.PasswordEncoder;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.InvalidInputException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.annotation.Nullable;

public class DefaultUserServiceImpl extends AccountService implements UserService {
  final UserRepository userRepository;
  final AuthorizationService authorizationService;
  final SmartLibraryAccessControlRepository accessControlRepository;
  private final SmartLibraryService smartLibraryService;

  public DefaultUserServiceImpl(
      UserRepository userRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      AuthorizationService authorizationService,
      SmartLibraryAccessControlRepository accessControlRepository,
      SmartLibraryService smartLibraryService) {
    super(accountRepository, passwordEncoder, uuidGenerator, dateTimeGenerator);
    this.userRepository = userRepository;
    this.authorizationService = authorizationService;
    this.accessControlRepository = accessControlRepository;
    this.smartLibraryService = smartLibraryService;
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

  protected Mono<GrantedAccess> create(
      @Nullable OrgId orgId,
      List<String> slid,
      ZonedDateTime expiresAt,
      AccessCredential credential,
      String accessId) {

    return authorizationService
        .getAccountPrincipal()
        .map(
            principal -> {
              String orgIdToUse = principal.orgId();

              if (principal.isSuperAdmin()) {

                if (Objects.isNull(orgId)) {
                  throw new InvalidInputException("org id must be provided");
                }

                orgIdToUse = orgId.value();
              }

              return SmartLibraryAccess.builder()
                  .id(accessId)
                  .credential(credential.credential())
                  .createdAt(dateTimeGenerator.next())
                  .updatedAt(dateTimeGenerator.next())
                  .contactLessId(credential.contactLess())
                  .orgId(orgIdToUse)
                  .slid(slid)
                  .isActive(true)
                  .expiresAt(expiresAt)
                  .origin(principal.audience())
                  .audit(principal.subject())
                  .build();
            })
        .flatMap(accessControlRepository::save)
        .map(GrantedAccess::from);
  }

  @Override
  public Mono<GrantedAccess> create(Slid slid, OrgId orgId, UserAccessDto access) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal ->
                smartLibraryService
                    .smartLibrariesValidated(principal, slid)
                    .flatMap(
                        ignored ->
                            Mono.just(access.getCredential())
                                .flatMap(
                                    credential ->
                                        validateCredentials(credential, principal.orgId()))
                                .flatMap(
                                    credential ->
                                        create(
                                            orgId,
                                            List.of(slid.value()),
                                            access.expiresAt(),
                                            credential,
                                            uuidGenerator.next()))));
  }

  @Override
  public Mono<GrantedAccess> create(List<Slid> slid, OrgId orgId, UserAccessDto access) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal ->
                Mono.just(access.getCredential())
                    .flatMap(credential -> validateCredentials(credential, principal.orgId()))
                    .flatMap(
                        credential ->
                            create(
                                orgId,
                                slid.stream().map(Slid::value).toList(),
                                access.expiresAt(),
                                credential,
                                uuidGenerator.next())));
  }

  @Override
  public Flux<SmartLibraryAccessDto> getAccesses(Slid slid, boolean synced) {
    return this.accessControlRepository.findAllBy(slid, synced).map(SmartLibraryAccessDto::from);
  }

  @Override
  public Flux<SmartLibraryAccessDto> getAccesses(Slid slid) {
    return accessControlRepository.findAllBy(slid).map(SmartLibraryAccessDto::from);
  }

  Mono<AccessCredential> validateCredentials(AccessCredential credential, String orgId) {
    return Mono.fromCallable(
            () -> {
              if (credential.credential().isPresent() && credential.contactLess().isPresent()) {
                return accessControlRepository
                    .findActiveBy(credential.credential().get(), credential.contactLess().get())
                    .flatMap(
                        (ignored) -> Mono.error(new RuntimeException("access is still active")));
              } else if (credential.credential().isPresent()) {
                return accessControlRepository
                    .findActiveByCredential(credential.credential().get())
                    .flatMap(
                        (ignored) -> Mono.error(new RuntimeException("access is still active")));
              } else if (credential.contactLess().isPresent()) {
                return accessControlRepository
                    .findActiveByContactLessId(credential.contactLess().get())
                    .flatMap(
                        (ignored) -> Mono.error(new RuntimeException("access is still active")));
              }
              throw new InvalidInputException("credential required");
            })
        .flatMap(Function.identity())
        .thenReturn(credential);
  }
}
