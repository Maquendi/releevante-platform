package com.releevante.core.application.service;

import com.releevante.core.application.dto.CreateCartDto;
import com.releevante.core.application.dto.UpdateCartDto;
import com.releevante.core.domain.Cart;
import com.releevante.core.domain.CartId;
import com.releevante.core.domain.CartItem;
import com.releevante.core.domain.ClientId;
import com.releevante.types.Slid;
import com.releevante.types.UserId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CartService {
  Mono<Cart> initializeCart(Slid slid, UserId userId, CreateCartDto cart);

  Mono<Cart> initializeCart(UserId userId, CreateCartDto cart);

  Mono<?> checkoutCart(CartId cartId);

  Flux<CartItem> updateCart(UpdateCartDto cart);

  Flux<CreateCartDto> getAllByClient(ClientId clientId);
}
