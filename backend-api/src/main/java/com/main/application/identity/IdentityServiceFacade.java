package com.main.application.identity;

import com.main.config.security.JwtAuthenticationToken;
import com.releevante.identity.application.dto.*;
import com.releevante.types.Slid;
import lombok.NonNull;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface IdentityServiceFacade {
  Mono<JwtAuthenticationToken> verifyToken(@NonNull String token);

  Mono<UserIdDto> create(UserDto userDto);

  Mono<AccountIdDto> create(AccountDto accountDto);

  Mono<SmartLibraryGrantedAccess> create(UserAccessDto access);

  Flux<SmartLibraryGrantedAccess> getUnSyncedAccesses(Slid slid);

  Mono<UserAuthenticationDto> authenticate(LoginDto loginDto);

  Mono<SmartLibraryAccessDto> authenticate(PinLoginDto loginDto);

  Mono<AccountIdDto> create(OrgDto orgDto);
}
