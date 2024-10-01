/* (C)2024 */
package com.releevante.application.service.user;

import com.releevante.application.dto.AccountDto;
import com.releevante.application.dto.AccountIdDto;
import com.releevante.application.dto.UserDto;
import com.releevante.application.dto.UserIdDto;
import com.releevante.application.service.auth.AuthorizationService;
import com.releevante.identity.domain.model.*;
import com.releevante.identity.domain.repository.AccountRepository;
import com.releevante.identity.domain.repository.UserRepository;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import reactor.core.publisher.Mono;

public class DefaultUserServiceImpl extends AccountService implements UserService {
  final UserRepository userRepository;
  final AuthorizationService authorizationService;

  public DefaultUserServiceImpl(
      UserRepository userRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      AuthorizationService authorizationService) {
    super(accountRepository, passwordEncoder, uuidGenerator, dateTimeGenerator);
    this.userRepository = userRepository;
    this.authorizationService = authorizationService;
  }

  @Override
  public Mono<UserIdDto> createUser(UserDto userDto) {

    return null;
  }

  @Override
  public Mono<AccountIdDto> createAccount(AccountDto accountDto) {
    return authorizationService
        .checkAuthorities("account:create")
        .flatMap(principal -> createAccount(accountDto, OrgId.of(principal.orgId())))
        .flatMap(accountRepository::upsert)
        .map(LoginAccount::accountId)
        .map(AccountId::value)
        .map(AccountIdDto::of);
  }
}
