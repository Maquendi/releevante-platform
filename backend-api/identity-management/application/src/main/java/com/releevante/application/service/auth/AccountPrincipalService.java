/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public class AccountPrincipalService {
  private final AccountPrincipalHolder accountPrincipalHolder;

  public AccountPrincipalService(AccountPrincipalHolder accountPrincipalHolder) {
    this.accountPrincipalHolder = accountPrincipalHolder;
  }

  Mono<AccountPrincipal> getAccountPrincipalMandatory() {
    return accountPrincipalHolder
        .getAccountPrincipal()
        .switchIfEmpty(Mono.error(new RuntimeException("")));
  }
}
