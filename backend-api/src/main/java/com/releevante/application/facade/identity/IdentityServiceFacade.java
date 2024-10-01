package com.releevante.application.facade.identity;

import com.releevante.application.dto.AccountDto;
import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.dto.UserDto;
import com.releevante.application.dto.UserIdDto;
import com.releevante.config.security.JwtAuthenticationToken;
import com.releevante.identity.domain.model.Audience;
import com.releevante.identity.domain.model.LoginToken;
import com.releevante.identity.domain.model.Password;
import com.releevante.identity.domain.model.UserName;
import com.releevante.types.AccountPrincipal;
import lombok.NonNull;
import reactor.core.publisher.Mono;

public interface IdentityServiceFacade {
  Mono<JwtAuthenticationToken> verifyToken(@NonNull String token);

  Mono<UserIdDto> createUser(UserDto userDto);

  Mono<AccountIdDto> createAccount(AccountDto accountDto);

  Mono<LoginToken> authenticate(UserName userName, Password password, Audience audience);

  Mono<AccountPrincipal> authenticate(LoginToken token);
}
