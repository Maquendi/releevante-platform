/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.M2MClientsRepository;
import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public class M2MDefaultAuthenticationService implements AuthenticationService {
  final M2MClientsRepository m2MClientsRepository;
  final JtwTokenService<M2MClient> tokenService;

  public M2MDefaultAuthenticationService(
      M2MClientsRepository m2MClientsRepository, JtwTokenService<M2MClient> tokenService) {
    this.m2MClientsRepository = m2MClientsRepository;
    this.tokenService = tokenService;
  }

  @Override
  public Mono<LoginToken> authenticate(UserName userName, Password password, Audience audience) {
    return m2MClientsRepository
        .findBy(userName, password)
        .filter(M2MClient::isActive)
        .flatMap(payload -> tokenService.generateToken(payload, audience));
  }

  @Override
  public Mono<AccountPrincipal> authenticate(LoginToken token) {
    return tokenService.verifyToken(token);
  }
}
