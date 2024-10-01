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
import reactor.core.publisher.Mono;

public class DefaultUserServiceImpl implements UserService {
  final UserRepository userRepository;
  final AccountRepository accountRepository;
  final PasswordEncoder passwordEncoder;
  final SequentialGenerator<String> uuidGenerator;
  final AuthorizationService authorizationService;

  public DefaultUserServiceImpl(
      UserRepository userRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      AuthorizationService authorizationService) {
    this.userRepository = userRepository;
    this.accountRepository = accountRepository;
    this.passwordEncoder = passwordEncoder;
    this.uuidGenerator = uuidGenerator;
    this.authorizationService = authorizationService;
  }

  @Override
  public Mono<UserIdDto> createUser(UserDto userDto) {

    return null;
  }

  @Override
  public Mono<AccountIdDto> createAccount(AccountDto accountDto) {
    return authorizationService
        .checkAccountAuthorized("account::create")
        .flatMap(
            principal ->
                Mono.just(UserName.of(accountDto.userName()))
                    .flatMap(
                        userName ->
                            accountRepository
                                .findBy(userName)
                                .filterWhen(this::throwEntityExists)
                                .switchIfEmpty(
                                    Mono.fromCallable(
                                        () -> {
                                          var passwordHash =
                                              Password.from(accountDto.password(), passwordEncoder);
                                          var accountId = AccountId.of(uuidGenerator.next());
                                          var orgId = OrgId.of(principal.orgId());
                                          return LoginAccount.builder()
                                              .accountId(accountId)
                                              .orgId(orgId)
                                              .userName(userName)
                                              .password(passwordHash)
                                              .isActive(false)
                                              .build();
                                        })))
                    .flatMap(accountRepository::upsert)
                    .map(LoginAccount::accountId)
                    .map(AccountId::value)
                    .map(AccountIdDto::of));
  }

  Mono<Boolean> throwEntityExists(LoginAccount account) {
    return Mono.error(new RuntimeException("Account already exists"));
  }
}
