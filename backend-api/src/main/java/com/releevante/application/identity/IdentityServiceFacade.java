package com.releevante.application.identity;

import com.releevante.application.dto.*;
import com.releevante.config.security.JwtAuthenticationToken;
import lombok.NonNull;
import reactor.core.publisher.Mono;

public interface IdentityServiceFacade {
  Mono<JwtAuthenticationToken> verifyToken(@NonNull String token);

  Mono<UserIdDto> create(UserDto userDto);

  Mono<AccountIdDto> create(AccountDto accountDto);

  Mono<LoginTokenDto> authenticate(LoginDto loginDto);

  Mono<AccountIdDto> create(OrgDto orgDto);
}
