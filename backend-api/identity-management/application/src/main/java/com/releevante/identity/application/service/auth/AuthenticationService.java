/* (C)2024 */
package com.releevante.identity.application.service.auth;

import com.releevante.identity.application.dto.*;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AuthenticationService {
  Mono<UserAuthenticationDto> authenticate(LoginDto loginDto);

  Mono<SmartLibraryAccessDto> authenticate(PinLoginDto loginDto);

  Mono<SmartLibraryAccessDto> authenticate(NfcLoginDto loginDto);

  Mono<AccountPrincipal> authenticate(LoginTokenDto token);
}
