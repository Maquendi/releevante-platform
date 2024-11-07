package com.releevante.core.application.service;

import com.releevante.core.application.dto.CartDto;
import com.releevante.core.domain.CartId;
import com.releevante.core.domain.ClientId;
import com.releevante.types.Slid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CartService {
  Mono<CartId> initializeCart(Slid slid, CartDto cart);

  Mono<CartId> initializeCart(CartDto cart);

  Mono<CartId> updateCart(CartId cartId, CartDto cart);

  Flux<CartDto> getAllByClient(ClientId clientId);
}
