/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.identity.domain.model.*;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AuthenticationService {
  Mono<LoginToken> authenticate(UserName userName, Password password, Audience audience);

  Mono<AccountPrincipal> authenticate(LoginToken token);
}
