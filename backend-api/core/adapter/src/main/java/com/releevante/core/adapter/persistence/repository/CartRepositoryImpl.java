package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.CartHibernateDao;
import com.releevante.core.adapter.persistence.dao.CartItemHibernateDao;
import com.releevante.core.adapter.persistence.records.CartItemRecord;
import com.releevante.core.adapter.persistence.records.CartRecord;
import com.releevante.core.domain.Cart;
import com.releevante.core.domain.CartId;
import com.releevante.core.domain.CartItem;
import com.releevante.core.domain.Client;
import com.releevante.core.domain.repository.CartRepository;
import com.releevante.types.UserId;
import java.util.List;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class CartRepositoryImpl implements CartRepository {

  final CartHibernateDao cartHibernateDao;
  final CartItemHibernateDao cartItemHibernateDao;

  public CartRepositoryImpl(
      CartHibernateDao cartHibernateDao, CartItemHibernateDao cartItemHibernateDao) {
    this.cartHibernateDao = cartHibernateDao;
    this.cartItemHibernateDao = cartItemHibernateDao;
  }

  @Override
  public Flux<Cart> getByUser(UserId user) {

    cartHibernateDao.findById(user.value());

    return null;
  }

  @Override
  public Mono<Client> save(Client client) {
    return null;
  }

  @Override
  public Mono<Cart> create(Cart cart) {
    return cartHibernateDao
        .save(CartRecord.from(cart))
        .flatMapMany(
            cartRecord ->
                cartItemHibernateDao.saveAll(CartItemRecord.fromDomain(cartRecord, cart.items())))
        .collectList()
        .thenReturn(cart);
  }

  @Override
  public Mono<Cart> find(CartId cartId) {
    return cartHibernateDao
        .findById(cartId.value())
        .map(CartRecord::toDomain)
        .flatMap(
            cart ->
                cartItemHibernateDao
                    .findAllByCartId(cartId.value())
                    .map(CartItemRecord::toDomain)
                    .collectList()
                    .map(cart::withItems));
  }

  @Override
  public Flux<CartItem> updateItems(CartId cartId, List<CartItem> items) {
    return cartItemHibernateDao
        .saveAll(CartItemRecord.fromDomainForUpdate(cartId.value(), items))
        .thenMany(Flux.fromIterable(items));
  }

  @Override
  public Flux<CartItem> addItems(CartId cartId, List<CartItem> items) {
    return cartItemHibernateDao
        .saveAll(CartItemRecord.fromDomain(cartId.value(), items))
        .thenMany(Flux.fromIterable(items));
  }
}
