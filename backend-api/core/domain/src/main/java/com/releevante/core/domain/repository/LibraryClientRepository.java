package com.releevante.core.domain.repository;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ClientId;
import reactor.core.publisher.Mono;

public interface LibraryClientRepository {
  Mono<Client> find(ClientId clientId);
}
