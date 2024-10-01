/* (C)2024 */
package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.AccountId;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.identity.domain.model.Password;
import com.releevante.identity.domain.model.UserName;
import reactor.core.publisher.Mono;

public interface AccountRepository {
  Mono<LoginAccount> findBy(AccountId accountId);

  Mono<LoginAccount> findBy(UserName userName);

  Mono<LoginAccount> findBy(UserName userName, Password password);

  Mono<LoginAccount> upsert(LoginAccount account);
}
