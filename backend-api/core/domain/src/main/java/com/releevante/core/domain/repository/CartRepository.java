package com.releevante.core.domain.repository;

import com.releevante.core.domain.Cart;
import com.releevante.core.domain.CartId;
import com.releevante.core.domain.CartItem;
import com.releevante.core.domain.Client;
import com.releevante.types.UserId;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CartRepository {
  Flux<Cart> getByUser(UserId user);

  Mono<Client> save(Client client);

  Mono<Cart> create(Cart cart);

  Mono<Cart> find(CartId cartId);

  Flux<CartItem> updateItems(CartId cartId, List<CartItem> items);

  Flux<CartItem> addItems(CartId cartId, List<CartItem> items);
}
