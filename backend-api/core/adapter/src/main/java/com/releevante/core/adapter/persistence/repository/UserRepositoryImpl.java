package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.UserDao;
import com.releevante.core.adapter.persistence.records.UserRecord;
import com.releevante.core.domain.identity.model.AccountId;
import com.releevante.core.domain.identity.model.User;
import com.releevante.core.domain.identity.repository.UserRepository;
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
    return userDao.findById(accountId.value()).map(UserRecord::toDomain);
  }
}
