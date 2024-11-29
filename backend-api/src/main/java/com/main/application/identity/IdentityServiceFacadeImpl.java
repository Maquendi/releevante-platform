/* (C)2024 */
package com.main.application.identity;

import com.main.config.security.CustomAuthenticationException;
import com.main.config.security.JwtAuthenticationToken;
import com.releevante.core.application.service.SmartLibraryService;
import com.releevante.identity.application.dto.*;
import com.releevante.identity.application.service.auth.AuthenticationService;
import com.releevante.identity.application.service.auth.AuthorizationService;
import com.releevante.identity.application.service.user.OrgService;
import com.releevante.identity.application.service.user.UserService;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NonNull;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class IdentityServiceFacadeImpl implements IdentityServiceFacade {
  final AuthenticationService authenticationService;
  final UserService userService;
  final OrgService orgService;
  final AuthorizationService authorizationService;
  private final SmartLibraryService smartLibraryService;

  public IdentityServiceFacadeImpl(
      AuthenticationService userAuthenticationService,
      UserService userService,
      OrgService orgService,
      AuthorizationService authorizationService,
      SmartLibraryService smartLibraryService) {
    this.authenticationService = userAuthenticationService;
    this.orgService = orgService;
    this.userService = userService;
    this.authorizationService = authorizationService;
    this.smartLibraryService = smartLibraryService;
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
  public Mono<List<GrantedAccess>> create(UserAccessDto access) {
    return authorizationService
        .getAccountPrincipal()
        .flatMap(
            principal -> {
              var slidSet = access.sLids().stream().map(Slid::of).collect(Collectors.toSet());
              return smartLibraryService
                  .smartLibrariesValidated(principal, slidSet)
                  .collectList()
                  .flatMap(ignored -> userService.create(access).collectList());
            });
  }

  @Override
  public Flux<GrantedAccess> getUnSyncedAccesses(Slid slid, boolean synced) {
    return userService.getUnSyncedAccesses(slid, synced);
  }

  @Override
  public Mono<UserAuthenticationDto> authenticate(LoginDto loginDto) {
    return authenticationService.authenticate(loginDto);
  }

  @Override
  public Mono<PinAuthenticationDto> authenticate(PinLoginDto loginDto) {
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
