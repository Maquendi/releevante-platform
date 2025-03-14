/* (C)2024 */
package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.AccountId;
import com.releevante.core.domain.identity.model.LoginAccount;
import com.releevante.core.domain.identity.model.Password;
import com.releevante.core.domain.identity.model.UserName;
import reactor.core.publisher.Mono;

public interface AccountRepository {
  Mono<LoginAccount> findBy(AccountId accountId);

  Mono<LoginAccount> findBy(UserName userName);

  Mono<LoginAccount> findBy(UserName userName, Password password);

  Mono<LoginAccount> upsert(LoginAccount account);
}
