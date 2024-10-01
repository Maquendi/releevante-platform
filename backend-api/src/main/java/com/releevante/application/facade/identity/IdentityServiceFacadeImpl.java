/* (C)2024 */
package com.releevante.application.facade.identity;

import com.releevante.application.dto.AccountDto;
import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.dto.UserDto;
import com.releevante.application.dto.UserIdDto;
import com.releevante.application.service.auth.AuthenticationService;
import com.releevante.application.service.user.UserService;
import com.releevante.config.security.JwtAuthenticationToken;
import com.releevante.identity.domain.model.Audience;
import com.releevante.identity.domain.model.LoginToken;
import com.releevante.identity.domain.model.Password;
import com.releevante.identity.domain.model.UserName;
import com.releevante.types.AccountPrincipal;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class IdentityServiceFacadeImpl implements IdentityServiceFacade {
  @Qualifier("userAuthenticationService") final AuthenticationService userAuthenticationService;

  @Qualifier("m2mAuthenticationService") final AuthenticationService m2mAuthenticationService;

  final UserService userService;

  public IdentityServiceFacadeImpl(
      AuthenticationService userAuthenticationService,
      AuthenticationService m2mAuthenticationService,
      UserService userService) {
    this.userAuthenticationService = userAuthenticationService;
    this.m2mAuthenticationService = m2mAuthenticationService;
    this.userService = userService;
  }

  @Override
  public Mono<UserIdDto> createUser(UserDto userDto) {
    return userService.createUser(userDto);
  }

  @Override
  public Mono<AccountIdDto> createAccount(AccountDto accountDto) {
    return userService.createAccount(accountDto);
  }

  @Override
  public Mono<LoginToken> authenticate(UserName userName, Password password, Audience audience) {
    return userAuthenticationService.authenticate(userName, password, audience);
  }

  @Override
  public Mono<AccountPrincipal> authenticate(LoginToken token) {
    return userAuthenticationService.authenticate(token);
  }

  @Override
  public Mono<JwtAuthenticationToken> verifyToken(@NonNull String token) {
    return Mono.just(LoginToken.of(token))
        .flatMap(
            loginToken ->
                userAuthenticationService
                    .authenticate(loginToken)
                    .map(
                        accountPrincipal ->
                            new JwtAuthenticationToken(accountPrincipal, loginToken)));
  }
}
