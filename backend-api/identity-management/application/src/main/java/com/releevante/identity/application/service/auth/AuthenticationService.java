/* (C)2024 */
package com.releevante.identity.application.service.auth;

import com.releevante.identity.application.dto.*;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AuthenticationService {
  Mono<UserAuthenticationDto> authenticate(LoginDto loginDto);

  Mono<PinAuthenticationDto> authenticate(PinLoginDto loginDto);

  Mono<AggregatorLoginResponse> authenticate(AggregatorLogin loginDto);

  Mono<AccountPrincipal> authenticate(LoginTokenDto token);
}
