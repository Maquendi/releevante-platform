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

public class DefaultUserServiceImpl implements UserService {
  final UserRepository userRepository;
  final AccountRepository accountRepository;
  final PasswordEncoder passwordEncoder;
  final SequentialGenerator<String> uuidGenerator;
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator;
  final AuthorizationService authorizationService;

  public DefaultUserServiceImpl(
      UserRepository userRepository,
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      AuthorizationService authorizationService) {
    this.userRepository = userRepository;
    this.accountRepository = accountRepository;
    this.passwordEncoder = passwordEncoder;
    this.uuidGenerator = uuidGenerator;
    this.dateTimeGenerator = dateTimeGenerator;
    this.authorizationService = authorizationService;
  }

  @Override
  public Mono<UserIdDto> createUser(UserDto userDto) {

    return null;
  }

  @Override
  public Mono<AccountIdDto> createAccount(AccountDto accountDto) {
    return authorizationService
        .checkAccountAuthorized("account:create")
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
                                          var createdAt = dateTimeGenerator.next();
                                          return LoginAccount.builder()
                                              .accountId(accountId)
                                              .orgId(orgId)
                                              .userName(userName)
                                              .password(passwordHash)
                                              .createdAt(createdAt)
                                              .updatedAt(createdAt)
                                              .isActive(false)
                                              .build();
                                        })))
                    .flatMap(accountRepository::upsert)
                    .map(LoginAccount::accountId)
                    .map(AccountId::value)
                    .map(AccountIdDto::of));
  }

  Mono<Boolean> throwEntityExists(LoginAccount account) {
    return Mono.error(new RuntimeException("account already exists"));
  }
}
