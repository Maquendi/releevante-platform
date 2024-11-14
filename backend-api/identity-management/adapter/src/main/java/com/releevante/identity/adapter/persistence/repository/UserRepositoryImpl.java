package com.releevante.identity.adapter.persistence.repository;

import com.releevante.identity.adapter.persistence.records.UserRecord;
import com.releevante.identity.adapter.persistence.repository.components.UserDao;
import com.releevante.identity.domain.model.AccountId;
import com.releevante.identity.domain.model.User;
import com.releevante.identity.domain.repository.UserRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class UserRepositoryImpl implements UserRepository {

  final UserDao userDao;

  public UserRepositoryImpl(UserDao userDao) {
    this.userDao = userDao;
  }

  @Override
  public Mono<User> upsert(User user) {
    return Mono.just(UserRecord.from(user)).flatMap(userDao::save).thenReturn(user);
  }

  @Override
  public Mono<User> findBy(AccountId accountId) {
    return userDao.findByAccountId(accountId.value()).map(UserRecord::toDomain);
  }
}
