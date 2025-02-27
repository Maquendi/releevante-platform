/* (C)2024 */
package com.releevante.core.application.identity.service.auth;

import com.releevante.core.application.identity.dto.*;
import com.releevante.core.domain.identity.model.*;
import com.releevante.core.domain.identity.repository.*;
import com.releevante.core.domain.identity.service.PasswordEncoder;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.exceptions.UserUnauthorizedException;
import com.releevante.types.utils.HashUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultUserAuthenticationService implements AuthenticationService {
  final AccountRepository accountRepository;
  final JtwTokenService tokenService;
  final PasswordEncoder passwordEncoder;
  final PrivilegeRepository permissionsRepository;
  final OrgRepository orgRepository;
  final SmartLibraryAccessControlRepository accessControlRepository;
  final UserRepository userRepository;
  final AuthorizedOriginRepository authorizedOriginRepository;
  final AuthorizationService authorizationService;

  public DefaultUserAuthenticationService(
      AccountRepository accountRepository,
      JtwTokenService tokenService,
      PasswordEncoder passwordEncoder,
      PrivilegeRepository permissionsRepository,
      OrgRepository orgRepository,
      SmartLibraryAccessControlRepository accessControlRepository,
      UserRepository userRepository,
      AuthorizedOriginRepository authorizedOriginRepository,
      AuthorizationService authorizationService) {
    this.accountRepository = accountRepository;
    this.tokenService = tokenService;
    this.passwordEncoder = passwordEncoder;
    this.permissionsRepository = permissionsRepository;
    this.orgRepository = orgRepository;
    this.accessControlRepository = accessControlRepository;
    this.userRepository = userRepository;
    this.authorizedOriginRepository = authorizedOriginRepository;
    this.authorizationService = authorizationService;
  }

  @Override
  public Mono<UserAuthenticationDto> authenticate(UserLoginDto loginDto) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal ->
                accountRepository
                    .findBy(UserName.of(loginDto.userName()))
                    .map(LoginAccount::checkIsActive)
                    .map(
                        account ->
                            account.validPasswordOrThrow(
                                Password.of(loginDto.password()), passwordEncoder))
                    .filterWhen(access -> this.validAudience(principal.audience()))
                    .flatMap(
                        account ->
                            orgRepository
                                .findBy(account.orgId())
                                .map(Organization::checkIsActive)
                                .flatMap(
                                    org ->
                                        Mono.zip(
                                                tokenService.generateToken(
                                                    principal.audience(), account),
                                                userRepository.findBy(account.accountId()))
                                            .map(
                                                data -> {
                                                  var token = data.getT1();
                                                  var user = data.getT2();
                                                  return UserAuthenticationDto.from(
                                                      token, account, user, org);
                                                })))
                    .switchIfEmpty(Mono.error(new UserUnauthorizedException())));
  }

  protected Mono<Boolean> validAudience(String audience) {
    return authorizedOriginRepository
        .findById(audience)
        .map(AuthorizedOrigin::isActive)
        .filter(Boolean::booleanValue)
        .switchIfEmpty(Mono.error(new UserUnauthorizedException()));
  }

  @Override
  public Mono<LoginTokenDto> authenticate(GuestLoginDto loginDto) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal ->
                Mono.just(loginDto.accessId())
                    .flatMapMany(this::findAllBy)
                    .switchIfEmpty(Mono.error(new UserUnauthorizedException()))
                    .single()
                    .filterWhen(access -> this.validAudience(principal.audience()))
                    .flatMap(
                        access ->
                            orgRepository
                                .findBy(OrgId.of(access.orgId()))
                                .map(Organization::checkIsActive)
                                .thenReturn(access))
                    .flatMap(
                        smartLibraryAccess ->
                            tokenService.generateToken(principal.audience(), smartLibraryAccess))
                    .switchIfEmpty(Mono.error(new UserUnauthorizedException())));
  }

  Flux<SmartLibraryAccess> findAllBy(String value) {
    if (value.length() == 4) {
      return accessControlRepository.findActiveByCredential(HashUtils.createSHAHash(value));
    }
    return accessControlRepository.findActiveByAccessId(value);
  }

  @Override
  public Mono<LoginTokenDto> authenticate(M2MLoginDto loginDto) {
    return authorizedOriginRepository
        .findById(loginDto.clientId())
        .filter(AuthorizedOrigin::isActive)
        .flatMap(tokenService::generateToken)
        .switchIfEmpty(Mono.error(new UserUnauthorizedException()));
  }

  @Override
  public Mono<AccountPrincipal> authenticate(LoginTokenDto token) {
    return tokenService.verifyToken(token);
  }
}
