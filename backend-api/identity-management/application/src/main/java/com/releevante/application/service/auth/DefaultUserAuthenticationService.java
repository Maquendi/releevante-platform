/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.application.dto.LoginDto;
import com.releevante.application.dto.LoginTokenDto;
import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.AccountRepository;
import com.releevante.identity.domain.repository.OrgRepository;
import com.releevante.identity.domain.repository.PrivilegeRepository;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public class DefaultUserAuthenticationService implements AuthenticationService {
  final AccountRepository accountRepository;
  final JtwTokenService<LoginAccount> tokenService;
  final PasswordEncoder passwordEncoder;
  final PrivilegeRepository permissionsRepository;
  final OrgRepository orgRepository;

  public DefaultUserAuthenticationService(
      AccountRepository accountRepository,
      JtwTokenService<LoginAccount> tokenService,
      PasswordEncoder passwordEncoder,
      PrivilegeRepository permissionsRepository,
      OrgRepository orgRepository) {
    this.accountRepository = accountRepository;
    this.tokenService = tokenService;
    this.passwordEncoder = passwordEncoder;
    this.permissionsRepository = permissionsRepository;
    this.orgRepository = orgRepository;
  }

  @Override
  public Mono<LoginTokenDto> authenticate(LoginDto loginDto) {
    return accountRepository
        .findBy(UserName.of(loginDto.userName()))
        .map(LoginAccount::checkIsActive)
        .map(
            account ->
                account.validPasswordOrThrow(Password.of(loginDto.password()), passwordEncoder))
        .flatMap(
            account ->
                orgRepository
                    .findBy(account.orgId())
                    .map(Organization::checkIsActive)
                    .thenReturn(account))
        .flatMap(
            account ->
                permissionsRepository
                    .findBy(account.roles())
                    .map(Privilege::value)
                    .collectList()
                    .map(account::withPermissions))
        .flatMap(tokenService::generateToken)
        .switchIfEmpty(Mono.error(new RuntimeException("Account not found")));
  }

  @Override
  public Mono<AccountPrincipal> authenticate(LoginTokenDto token) {
    return tokenService.verifyToken(token);
  }
}
