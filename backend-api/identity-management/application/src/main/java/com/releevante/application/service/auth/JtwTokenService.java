/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.application.dto.LoginTokenDto;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface JtwTokenService {
  Mono<LoginTokenDto> generateToken(LoginAccount payload);

  Mono<LoginTokenDto> generateToken(SmartLibraryAccess payload);

  Mono<AccountPrincipal> verifyToken(LoginTokenDto loginToken);
}
