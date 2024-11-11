package com.releevante.core.domain.repository;

import com.releevante.core.domain.Cart;
import com.releevante.types.UserId;
import reactor.core.publisher.Flux;

public interface CartRepository {
  Flux<Cart> getByUser(UserId user);
}
