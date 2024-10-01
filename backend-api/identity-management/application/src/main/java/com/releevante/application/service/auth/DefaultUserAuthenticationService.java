/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.AccountRepository;
import com.releevante.identity.domain.repository.PrivilegeRepository;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public class DefaultUserAuthenticationService implements AuthenticationService {
  final AccountRepository accountRepository;
  final JtwTokenService<LoginAccount> tokenService;
  final PasswordEncoder passwordEncoder;
  final PrivilegeRepository permissionsRepository;

  public DefaultUserAuthenticationService(
      AccountRepository accountRepository,
      JtwTokenService<LoginAccount> tokenService,
      PasswordEncoder passwordEncoder,
      PrivilegeRepository permissionsRepository) {
    this.accountRepository = accountRepository;
    this.tokenService = tokenService;
    this.passwordEncoder = passwordEncoder;
    this.permissionsRepository = permissionsRepository;
  }

  @Override
  public Mono<LoginToken> authenticate(UserName userName, Password password, Audience audience) {
    return accountRepository
        .findBy(userName)
        .filter(LoginAccount::isActive)
        .map(account -> account.validPasswordOrThrow(password, passwordEncoder))
        .flatMap(
            account ->
                permissionsRepository
                    .findBy(account.roles())
                    .map(Privilege::value)
                    .map(Role::of)
                    .collectList()
                    .map(
                        roles -> {
                          roles.addAll(account.roles());
                          return account.withRoles(roles);
                        }))
        .flatMap(payload -> tokenService.generateToken(payload, audience))
        .switchIfEmpty(Mono.error(new RuntimeException("Account not found")));
  }

  @Override
  public Mono<AccountPrincipal> authenticate(LoginToken token) {
    return tokenService.verifyToken(token);
  }
}
