package com.releevante.identity.application.identity;

import com.releevante.config.security.JwtAuthenticationToken;
import com.releevante.identity.application.dto.*;
import lombok.NonNull;
import reactor.core.publisher.Mono;

public interface IdentityServiceFacade {
  Mono<JwtAuthenticationToken> verifyToken(@NonNull String token);

  Mono<UserIdDto> create(UserDto userDto);

  Mono<AccountIdDto> create(AccountDto accountDto);

  Mono<SmartLibraryGrantedAccess> create(PinUserAccessDto access);

  Mono<SmartLibraryGrantedAccess> create(NfcUserAccessDto access);

  Mono<UserAuthenticationDto> authenticate(LoginDto loginDto);

  Mono<SmartLibraryAccessDto> authenticate(PinLoginDto loginDto);

  Mono<SmartLibraryAccessDto> authenticate(NfcLoginDto loginDto);

  Mono<AccountIdDto> create(OrgDto orgDto);
}
