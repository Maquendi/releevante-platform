/* (C)2024 */
package com.releevante.identity.application.service.user;

import com.releevante.identity.application.dto.*;
import reactor.core.publisher.Mono;

public interface UserService {
  Mono<UserIdDto> createUser(UserDto userDto);

  Mono<AccountIdDto> createAccount(AccountDto accountDto);

  Mono<SmartLibraryGrantedAccess> create(PinUserAccessDto access);

  Mono<SmartLibraryGrantedAccess> create(NfcUserAccessDto access);
}
