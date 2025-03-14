/* (C)2024 */
package com.releevante.core.application.identity.service.user;

import com.releevante.core.application.identity.dto.*;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.annotation.Nullable;

public interface UserService {
  Mono<UserIdDto> createUser(UserDto userDto);

  Mono<AccountIdDto> createAccount(AccountDto accountDto);

  Mono<GrantedAccess> create(Slid slid, @Nullable OrgId orgId, UserAccessDto access);

  Mono<GrantedAccess> create(List<Slid> slid, OrgId orgId, UserAccessDto access);

  Flux<SmartLibraryAccessDto> getAccesses(Slid slid, boolean synced);

  Flux<SmartLibraryAccessDto> getAccesses(Slid slid);
}
