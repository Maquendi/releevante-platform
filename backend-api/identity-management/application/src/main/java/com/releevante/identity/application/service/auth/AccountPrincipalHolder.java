/* (C)2024 */
package com.releevante.identity.application.service.auth;

import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AccountPrincipalHolder {
  Mono<AccountPrincipal> getAccountPrincipal();
}
