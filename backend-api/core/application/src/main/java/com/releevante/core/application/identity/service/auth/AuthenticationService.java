/* (C)2024 */
package com.releevante.core.application.identity.service.auth;

import com.releevante.core.application.identity.dto.*;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AuthenticationService {
  Mono<UserAuthenticationDto> authenticate(UserLoginDto loginDto);

  Mono<LoginTokenDto> authenticate(GuestLoginDto loginDto);

  Mono<LoginTokenDto> authenticate(M2MLoginDto loginDto);

  Mono<AccountPrincipal> authenticate(LoginTokenDto token);
}
