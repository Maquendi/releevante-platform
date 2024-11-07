/* (C)2024 */
package com.releevante.application.service.user;

import com.releevante.application.dto.*;
import reactor.core.publisher.Mono;

public interface UserService {
  Mono<UserIdDto> createUser(UserDto userDto);

  Mono<AccountIdDto> createAccount(AccountDto accountDto);

  Mono<SmartLibraryGrantedAccess> create(UserAccessDto access);
}
