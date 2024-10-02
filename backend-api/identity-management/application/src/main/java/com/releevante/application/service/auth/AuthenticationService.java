/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.application.dto.LoginDto;
import com.releevante.application.dto.LoginTokenDto;
import com.releevante.identity.domain.model.*;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AuthenticationService {
  Mono<LoginTokenDto> authenticate(LoginDto loginDto);

  Mono<AccountPrincipal> authenticate(LoginTokenDto token);
}
