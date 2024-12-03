/* (C)2024 */
package com.releevante.identity.application.service.auth;

import com.releevante.identity.application.dto.LoginTokenDto;
import com.releevante.identity.domain.model.AuthorizedOrigin;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface JtwTokenService {
  Mono<LoginTokenDto> generateToken(String audience, LoginAccount payload);

  Mono<LoginTokenDto> generateToken(AuthorizedOrigin authorizedOrigin);

  Mono<LoginTokenDto> generateToken(SmartLibraryAccess payload);

  Mono<AccountPrincipal> verifyToken(LoginTokenDto loginToken);
}
