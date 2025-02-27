package com.releevante.core.application.identity.service.user;

import com.releevante.core.application.identity.dto.AccountDto;
import com.releevante.core.domain.identity.model.*;
import com.releevante.core.domain.identity.repository.AccountRepository;
import com.releevante.core.domain.identity.service.PasswordEncoder;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.exceptions.InvalidInputException;
import java.time.ZonedDateTime;
import reactor.core.publisher.Mono;

public class AccountService {
  final AccountRepository accountRepository;
  final PasswordEncoder passwordEncoder;
  final SequentialGenerator<String> uuidGenerator;
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator;

  public AccountService(
      AccountRepository accountRepository,
      PasswordEncoder passwordEncoder,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    this.accountRepository = accountRepository;
    this.passwordEncoder = passwordEncoder;
    this.uuidGenerator = uuidGenerator;
    this.dateTimeGenerator = dateTimeGenerator;
  }

  protected Mono<LoginAccount> createAccount(AccountDto accountDto, OrgId orgId) {
    return Mono.just(UserName.of(accountDto.userName().orElse(accountDto.email())))
        .flatMap(
            userName ->
                accountRepository
                    .findBy(userName)
                    .filterWhen(this::throwEntityExists)
                    .switchIfEmpty(
                        Mono.fromCallable(
                            () -> {
                              // an email must be sent to the user to update his/her password.
                              var tempPassword = uuidGenerator.next();
                              var passwordHash = Password.from(tempPassword, passwordEncoder);
                              var accountId = AccountId.of(uuidGenerator.next());
                              var createdAt = dateTimeGenerator.next();
                              var email = Email.from(accountDto.email());
                              return LoginAccount.builder()
                                  .accountId(accountId)
                                  .orgId(orgId)
                                  .userName(userName)
                                  .password(passwordHash)
                                  .createdAt(createdAt)
                                  .updatedAt(createdAt)
                                  .email(email)
                                  .isActive(false)
                                  .build();
                            })));
  }

  Mono<Boolean> throwEntityExists(LoginAccount account) {
    return Mono.error(new InvalidInputException("account already exists"));
  }
}
