package com.releevante.core.application.service;

import com.releevante.types.AccountPrincipal;
import reactor.core.publisher.Mono;

public interface AccountAuthorizationService {
  Mono<AccountPrincipal> getCurrentPrincipal();
}
