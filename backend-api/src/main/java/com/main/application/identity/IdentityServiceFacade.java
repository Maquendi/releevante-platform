package com.main.application.identity;

import com.main.config.security.JwtAuthenticationToken;
import com.releevante.core.application.identity.dto.*;
import lombok.NonNull;
import reactor.core.publisher.Mono;

public interface IdentityServiceFacade {
  Mono<JwtAuthenticationToken> verifyToken(@NonNull String token);

  Mono<UserIdDto> create(UserDto userDto);

  Mono<AccountIdDto> create(AccountDto accountDto);

  Mono<AccountIdDto> create(OrgDto orgDto);

  Mono<UserAuthenticationDto> authenticate(UserLoginDto loginDto);

  Mono<LoginTokenDto> authenticate(GuestLoginDto loginDto);

  Mono<LoginTokenDto> authenticate(M2MLoginDto loginDto);
}
