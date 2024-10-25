/* (C)2024 */
package com.releevante.application.identity;

import com.releevante.application.dto.*;
import com.releevante.application.service.auth.AuthenticationService;
import com.releevante.application.service.user.OrgService;
import com.releevante.application.service.user.UserService;
import com.releevante.config.security.CustomAuthenticationException;
import com.releevante.config.security.JwtAuthenticationToken;
import com.releevante.types.exceptions.UserUnauthorizedException;
import lombok.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Component
public class IdentityServiceFacadeImpl implements IdentityServiceFacade {
  final AuthenticationService authenticationService;
  final UserService userService;
  final OrgService orgService;

  public IdentityServiceFacadeImpl(
      AuthenticationService userAuthenticationService,
      UserService userService,
      OrgService orgService) {
    this.authenticationService = userAuthenticationService;
    this.orgService = orgService;
    this.userService = userService;
  }

  @Override
  public Mono<UserIdDto> create(UserDto userDto) {
    return userService.createUser(userDto);
  }

  @Override
  public Mono<AccountIdDto> create(AccountDto accountDto) {
    return userService.createAccount(accountDto);
  }

  @Override
  public Mono<UserAuthenticationDto> authenticate(LoginDto loginDto) {
    return authenticationService.authenticate(loginDto);
  }

  @Override
  public Mono<SmartLibraryAccessDto> authenticate(PinLoginDto loginDto) {
    return authenticationService.authenticate(loginDto);
  }

  @Transactional
  @Override
  public Mono<AccountIdDto> create(OrgDto orgDto) {
    return orgService.createOrg(orgDto);
  }

  @Override
  public Mono<JwtAuthenticationToken> verifyToken(@NonNull String token) {
    return Mono.just(LoginTokenDto.of(token))
        .flatMap(
            loginToken ->
                authenticationService
                    .authenticate(loginToken)
                    .map(
                        accountPrincipal ->
                            new JwtAuthenticationToken(accountPrincipal, loginToken)))
        .onErrorMap(UserUnauthorizedException.class, CustomAuthenticationException::new);
  }
}
