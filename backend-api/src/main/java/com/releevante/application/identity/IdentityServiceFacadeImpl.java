/* (C)2024 */
package com.releevante.application.identity;

import com.releevante.application.dto.*;
import com.releevante.application.service.auth.AuthenticationService;
import com.releevante.application.service.user.OrgService;
import com.releevante.application.service.user.UserService;
import com.releevante.config.security.JwtAuthenticationToken;
import lombok.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Component
public class IdentityServiceFacadeImpl implements IdentityServiceFacade {
  final AuthenticationService userAuthenticationService;
  final UserService userService;
  final OrgService orgService;

  public IdentityServiceFacadeImpl(
      AuthenticationService userAuthenticationService,
      UserService userService,
      OrgService orgService) {
    this.userAuthenticationService = userAuthenticationService;
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
  public Mono<LoginTokenDto> authenticate(LoginDto loginDto) {
    return userAuthenticationService.authenticate(loginDto);
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
                userAuthenticationService
                    .authenticate(loginToken)
                    .map(
                        accountPrincipal ->
                            new JwtAuthenticationToken(accountPrincipal, loginToken)));
  }
}
