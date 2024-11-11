package com.main.application.identity;

import com.main.config.security.JwtAuthenticationToken;
import com.releevante.application.dto.*;
import lombok.NonNull;
import reactor.core.publisher.Mono;

public interface IdentityServiceFacade {
  Mono<JwtAuthenticationToken> verifyToken(@NonNull String token);

  Mono<UserIdDto> create(UserDto userDto);

  Mono<AccountIdDto> create(AccountDto accountDto);

  Mono<SmartLibraryGrantedAccess> create(UserAccessDto access);

  Mono<UserAuthenticationDto> authenticate(LoginDto loginDto);

  Mono<SmartLibraryAccessDto> authenticate(PinLoginDto loginDto);

  Mono<AccountIdDto> create(OrgDto orgDto);
}
