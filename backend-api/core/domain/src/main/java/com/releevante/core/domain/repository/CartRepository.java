package com.releevante.core.domain.repository;

import com.releevante.core.domain.Cart;
import com.releevante.core.domain.Client;
import com.releevante.types.UserId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CartRepository {
  Flux<Cart> getByUser(UserId user);

  Mono<Client> save(Client client);
}
