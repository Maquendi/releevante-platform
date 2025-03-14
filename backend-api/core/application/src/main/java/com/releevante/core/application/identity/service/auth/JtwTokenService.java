/* (C)2024 */
package com.releevante.core.application.identity.service.auth;

import com.releevante.core.application.identity.dto.LoginTokenDto;
import com.releevante.core.domain.identity.model.AuthorizedOrigin;
import com.releevante.core.domain.identity.model.LoginAccount;
import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface JtwTokenService {
  Mono<LoginTokenDto> generateToken(String audience, LoginAccount payload);

  Mono<LoginTokenDto> generateToken(AuthorizedOrigin authorizedOrigin);

  Mono<LoginTokenDto> generateToken(String audience, SmartLibraryAccess payload);

  Mono<AccountPrincipal> verifyToken(LoginTokenDto loginToken);
}
