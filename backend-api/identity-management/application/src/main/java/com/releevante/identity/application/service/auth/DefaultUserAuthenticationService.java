/* (C)2024 */
package com.releevante.identity.application.service.auth;

import com.releevante.identity.application.dto.*;
import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.*;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.exceptions.UserUnauthorizedException;
import com.releevante.types.utils.HashUtils;
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

  public DefaultUserAuthenticationService(
      AccountRepository accountRepository,
      JtwTokenService tokenService,
      PasswordEncoder passwordEncoder,
      PrivilegeRepository permissionsRepository,
      OrgRepository orgRepository,
      SmartLibraryAccessControlRepository accessControlRepository,
      UserRepository userRepository,
      AuthorizedOriginRepository authorizedOriginRepository) {
    this.accountRepository = accountRepository;
    this.tokenService = tokenService;
    this.passwordEncoder = passwordEncoder;
    this.permissionsRepository = permissionsRepository;
    this.orgRepository = orgRepository;
    this.accessControlRepository = accessControlRepository;
    this.userRepository = userRepository;
    this.authorizedOriginRepository = authorizedOriginRepository;
  }

  @Override
  public Mono<UserAuthenticationDto> authenticate(LoginDto loginDto) {
    return accountRepository
        .findBy(UserName.of(loginDto.userName()))
        .map(LoginAccount::checkIsActive)
        .map(
            account ->
                account.validPasswordOrThrow(Password.of(loginDto.password()), passwordEncoder))
        .filterWhen(access -> this.validAudience(loginDto.origin()))
        .flatMap(
            account ->
                orgRepository
                    .findBy(account.orgId())
                    .map(Organization::checkIsActive)
                    .flatMap(
                        org ->
                            permissionsRepository
                                .findBy(account.roles())
                                .map(Privilege::value)
                                .collectList()
                                .map(account::withPermissions)
                                .flatMap(
                                    loginAccount ->
                                        Mono.zip(
                                                tokenService.generateToken(
                                                    loginDto.origin(), loginAccount),
                                                userRepository.findBy(loginAccount.accountId()))
                                            .map(
                                                data -> {
                                                  var token = data.getT1();
                                                  var user = data.getT2();
                                                  return UserAuthenticationDto.from(
                                                      token, loginAccount, user, org);
                                                }))))
        .switchIfEmpty(Mono.error(new UserUnauthorizedException()));
  }

  protected Mono<Boolean> validAudience(String audience) {
    return authorizedOriginRepository
        .findById(audience)
        .map(value -> true)
        .switchIfEmpty(Mono.error(new UserUnauthorizedException()));
  }

  @Override
  public Mono<PinAuthenticationDto> authenticate(PinLoginDto loginDto) {
    return Mono.just(HashUtils.createSHAHash(loginDto.accessCode()))
        .map(AccessCredentialValue::of)
        .flatMapMany(accessControlRepository::findBy)
        .filter(access -> access.slid().equals(loginDto.slid()))
        .filter(SmartLibraryAccess::isActive)
        .switchIfEmpty(Mono.error(new UserUnauthorizedException()))
        .single()
        .filterWhen(access -> this.validAudience(loginDto.slid()))
        .flatMap(
            access ->
                orgRepository
                    .findBy(access.orgId())
                    .map(Organization::checkIsActive)
                    .thenReturn(access))
        .flatMap(
            access ->
                tokenService
                    .generateToken(access)
                    .map(token -> PinAuthenticationDto.from(token, access)))
        .switchIfEmpty(Mono.error(new UserUnauthorizedException()));
  }

  @Override
  public Mono<AggregatorLoginResponse> authenticate(AggregatorLogin loginDto) {
    return authorizedOriginRepository
        .findById(loginDto.slid())
        .flatMap(tokenService::generateToken)
        .switchIfEmpty(Mono.error(new UserUnauthorizedException()));
  }

  @Override
  public Mono<AccountPrincipal> authenticate(LoginTokenDto token) {
    return tokenService.verifyToken(token);
  }
}
