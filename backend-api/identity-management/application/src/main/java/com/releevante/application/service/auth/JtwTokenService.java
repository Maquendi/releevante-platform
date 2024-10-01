/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.identity.domain.model.Audience;
import com.releevante.identity.domain.model.LoginToken;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface JtwTokenService<T> {
  Mono<LoginToken> generateToken(T payload, Audience audience);

  Mono<AccountPrincipal> verifyToken(LoginToken loginToken);
}
