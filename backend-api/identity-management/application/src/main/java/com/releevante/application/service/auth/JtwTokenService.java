/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.application.dto.LoginTokenDto;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface JtwTokenService<T> {
  Mono<LoginTokenDto> generateToken(T payload);

  Mono<AccountPrincipal> verifyToken(LoginTokenDto loginToken);
}
