/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AuthorizationService {
  Mono<AccountPrincipal> checkAuthorities(String... authorities);

  Mono<AccountPrincipal> getAccountPrincipal();
}
