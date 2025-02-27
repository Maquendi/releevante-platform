/* (C)2024 */
package com.main.application.identity;

import com.main.config.security.CustomAuthenticationException;
import com.main.config.security.JwtAuthenticationToken;
import com.releevante.core.application.identity.dto.*;
import com.releevante.core.application.identity.service.auth.AuthenticationService;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.identity.service.user.OrgService;
import com.releevante.core.application.identity.service.user.UserService;
import com.releevante.types.exceptions.UserUnauthorizedException;
import lombok.NonNull;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class IdentityServiceFacadeImpl implements IdentityServiceFacade {
  final AuthenticationService authenticationService;
  final UserService userService;
  final OrgService orgService;
  final AuthorizationService authorizationService;

  public IdentityServiceFacadeImpl(
      AuthenticationService userAuthenticationService,
      UserService userService,
      OrgService orgService,
      AuthorizationService authorizationService) {
    this.authenticationService = userAuthenticationService;
    this.orgService = orgService;
    this.userService = userService;
    this.authorizationService = authorizationService;
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
  public Mono<UserAuthenticationDto> authenticate(UserLoginDto loginDto) {
    return authenticationService.authenticate(loginDto);
  }

  @Override
  public Mono<LoginTokenDto> authenticate(GuestLoginDto loginDto) {
    return authenticationService.authenticate(loginDto);
  }

  @Override
  public Mono<LoginTokenDto> authenticate(M2MLoginDto loginDto) {
    return authenticationService.authenticate(loginDto);
  }

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
