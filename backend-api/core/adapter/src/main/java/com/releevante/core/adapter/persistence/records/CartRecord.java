package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.*;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "carts", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class CartRecord {
  @Id private String id;
  private String clientId;
  private String state;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "cart")
  private Set<CartItemRecord> cartItems = new HashSet<>();

  public Cart toDomain() {
    return Cart.builder()
        .id(CartId.of(id))
        .clientId(ClientId.of(clientId))
        .state(CartState.of(state))
        .items(
            new LazyLoaderInit<>(
                () ->
                    getCartItems().stream()
                        .map(CartItemRecord::toDomain)
                        .collect(Collectors.toList())))
        .updatedAt(updatedAt)
        .createAt(createdAt)
        .build();
  }

  public static CartRecord fromDomain(Cart cart) {
    var record = new CartRecord();
    record.setId(cart.id().value());
    record.setClientId(cart.clientId().value());
    record.setState(cart.state().value());
    record.setCreatedAt(cart.createAt());
    record.setUpdatedAt(cart.updatedAt());
    record.setCartItems(
        cart.items().get().stream().map(CartItemRecord::fromDomain).collect(Collectors.toSet()));
    return record;
  }
}
