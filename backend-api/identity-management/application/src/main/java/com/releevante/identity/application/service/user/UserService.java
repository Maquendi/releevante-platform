/* (C)2024 */
package com.releevante.identity.application.service.user;

import com.releevante.identity.application.dto.*;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserService {
  Mono<UserIdDto> createUser(UserDto userDto);

  Mono<AccountIdDto> createAccount(AccountDto accountDto);

  Flux<GrantedAccess> create(UserAccessDto access);

  Flux<SmartLibraryAccess> getAccesses(Slid slid, boolean synced);

  Flux<SmartLibraryAccess> getAccesses(Slid slid);
}
