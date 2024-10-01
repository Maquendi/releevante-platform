/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.repository;

import com.releevante.identity.adapter.out.persistence.records.AccountRecord;
import com.releevante.identity.adapter.out.persistence.repository.components.AccountDao;
import com.releevante.identity.domain.model.AccountId;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.identity.domain.model.Password;
import com.releevante.identity.domain.model.UserName;
import com.releevante.identity.domain.repository.AccountRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AccountRepositoryImpl implements AccountRepository {
  private final AccountDao accountDao;

  public AccountRepositoryImpl(AccountDao accountDao) {
    this.accountDao = accountDao;
  }

  @Override
  public Mono<LoginAccount> findBy(AccountId accountId) {
    return Mono.justOrEmpty(accountDao.findById(accountId.value())).map(AccountRecord::toDomain);
  }

  @Override
  public Mono<LoginAccount> findBy(UserName userName) {
    return Mono.justOrEmpty(accountDao.findByUserName(userName.value()))
        .map(AccountRecord::toDomain);
  }

  @Override
  public Mono<LoginAccount> findBy(UserName userName, Password password) {
    return Mono.justOrEmpty(
            accountDao.findByUserNameAndPasswordHash(userName.value(), password.value()))
        .map(AccountRecord::toDomain);
  }

  @Override
  public Mono<LoginAccount> upsert(LoginAccount account) {
    return Mono.just(accountDao.save(AccountRecord.fromDomain(account))).thenReturn(account);
  }
}
