/* (C)2024 */
package com.releevante.core.application.identity.service.user;

import com.releevante.core.application.identity.dto.*;
import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserService {
  Mono<UserIdDto> createUser(UserDto userDto);

  Mono<AccountIdDto> createAccount(AccountDto accountDto);

  Mono<GrantedAccess> create(Slid slid, UserAccessDto access);

  Flux<SmartLibraryAccess> getAccesses(Slid slid, boolean synced);

  Flux<SmartLibraryAccess> getAccesses(Slid slid);
}
