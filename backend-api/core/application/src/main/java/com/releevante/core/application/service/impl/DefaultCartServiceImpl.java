package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.CreateCartDto;
import com.releevante.core.application.dto.UpdateCartDto;
import com.releevante.core.application.service.BookLoanService;
import com.releevante.core.application.service.CartService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.CartRepository;
import com.releevante.types.*;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultCartServiceImpl implements CartService {
  final CartRepository cartRepository;
  final BookLoanService bookLoanService;
  SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public DefaultCartServiceImpl(CartRepository cartRepository, BookLoanService bookLoanService) {
    this.cartRepository = cartRepository;
    this.bookLoanService = bookLoanService;
  }

  @Override
  public Mono<Cart> initializeCart(Slid slid, UserId userId, CreateCartDto cart) {
    return initialize(slid, userId, cart);
  }

  @Override
  public Mono<Cart> initializeCart(UserId userId, CreateCartDto cart) {
    return initialize(null, userId, cart);
  }

  @Override
  public Mono<CartId> checkoutCart(CartId cartId) {
    return cartRepository
        .find(cartId)
        .flatMap(
            cart -> {
              return Mono.zip(handleLoan(cart), handleSale(cart)).thenReturn(cartId);
            });
  }

  Mono<Cart> handleSale(Cart cart) {
    return Mono.fromCallable(
            () -> cart.items().stream().filter(CartItem::forPurchase).collect(Collectors.toList()))
        .filter(Predicate.not(List::isEmpty))
        .map(
            cartItems -> {
              return cart;
            })
        .defaultIfEmpty(cart);
  }

  Mono<Cart> handleLoan(Cart cart) {

    return Mono.fromCallable(
            () ->
                cart.items().stream()
                    .filter(Predicate.not(CartItem::forPurchase))
                    .collect(Collectors.toList()))
        .filter(Predicate.not(List::isEmpty))
        .map(
            cartItems -> {
              return cart;
            })
        .defaultIfEmpty(cart);
  }

  @Override
  public Flux<CartItem> updateCart(UpdateCartDto cart) {

    var cartId = CartId.of(cart.cartId());

    var itemsCreate =
        cartRepository.addItems(
            cartId,
            cart.createItems().stream()
                .map(
                    item ->
                        CartItem.builder()
                            .id(uuidGenerator.next())
                            .isbn(Isbn.of(item.isbn()))
                            .qty(item.qty())
                            .forPurchase(item.forPurchase())
                            .build())
                .collect(Collectors.toList()));

    var itemsUpdate =
        cartRepository.updateItems(
            cartId,
            cart.updateItems().stream()
                .map(
                    item ->
                        CartItem.builder()
                            .id(item.id())
                            .isbn(Isbn.of(item.isbn()))
                            .qty(item.qty())
                            .forPurchase(item.forPurchase())
                            .build())
                .collect(Collectors.toList()));

    return Flux.mergeSequential(itemsCreate, itemsUpdate);
  }

  @Override
  public Flux<CreateCartDto> getAllByClient(ClientId clientId) {
    return null;
  }

  protected Mono<Cart> initialize(Slid slid, UserId userId, CreateCartDto cart) {
    return Mono.fromCallable(
            () ->
                Cart.builder()
                    .slid(Optional.ofNullable(slid))
                    .id(CartId.of(uuidGenerator.next()))
                    .userId(userId)
                    .createAt(dateTimeGenerator.next())
                    .updatedAt(dateTimeGenerator.next())
                    .state(CartState.of("INITIALIZED"))
                    .items(
                        cart.cartItems().stream()
                            .map(
                                item ->
                                    CartItem.builder()
                                        .id(uuidGenerator.next())
                                        .isbn(Isbn.of(item.isbn()))
                                        .qty(item.qty())
                                        .forPurchase(item.forPurchase())
                                        .build())
                            .collect(Collectors.toList()))
                    .build())
        .flatMap(cartRepository::create);
  }
}
