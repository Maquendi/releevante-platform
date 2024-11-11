/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.AccountRepository;
import com.releevante.identity.domain.repository.OrgRepository;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public class DefaultAuthorizationService implements AuthorizationService {
  final AccountRepository accountRepository;
  final OrgRepository orgRepository;
  final AccountPrincipalService accountPrincipalService;

  public DefaultAuthorizationService(
      AccountRepository accountRepository,
      OrgRepository orgRepository,
      AccountPrincipalService accountPrincipalService) {
    this.accountRepository = accountRepository;
    this.orgRepository = orgRepository;
    this.accountPrincipalService = accountPrincipalService;
  }

  @Override
  public Mono<AccountPrincipal> checkAuthorities(String... authorities) {
    return getAccountPrincipal()
        .flatMap(
            principal -> {
              var userName = UserName.of(principal.subject());
              var orgId = OrgId.of(principal.orgId());
              return accountRepository
                  .findBy(userName)
                  .map(account -> account.checkHasAnyAuthority(authorities))
                  .flatMap(account -> orgRepository.findBy(orgId))
                  .map(Organization::checkIsActive)
                  .thenReturn(principal);
            });
  }

  @Override
  public Mono<AccountPrincipal> getAccountPrincipal() {
    return accountPrincipalService.getAccountPrincipalMandatory();
  }
}
