/* (C)2024 */
package com.releevante.application.service.auth;

import com.releevante.application.dto.LoginDto;
import com.releevante.application.dto.LoginTokenDto;
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
  public Mono<LoginTokenDto> authenticate(LoginDto loginDto) {
    return m2MClientsRepository
        .findBy(UserName.of(loginDto.userName()), Password.of(loginDto.password()))
        .filter(M2MClient::isActive)
        .flatMap(tokenService::generateToken);
  }

  @Override
  public Mono<AccountPrincipal> authenticate(LoginTokenDto token) {
    return tokenService.verifyToken(token);
  }
}
