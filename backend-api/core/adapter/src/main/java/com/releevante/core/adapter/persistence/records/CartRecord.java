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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "client_id")
  private ClientRecord client;

  private String state;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "cart")
  private Set<CartItemRecord> cartItems = new HashSet<>();

  public Cart toDomain() {
    return Cart.builder()
        .id(CartId.of(id))
        .client(new LazyLoaderInit<>(() -> getClient().toDomain()))
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

  protected static CartRecord fromDomain(ClientRecord client, Cart cart) {
    var record = new CartRecord();
    record.setId(cart.id().value());
    record.setClient(client);
    record.setState(cart.state().value());
    record.setCreatedAt(cart.createAt());
    record.setUpdatedAt(cart.updatedAt());
    var cartItemRecords = CartItemRecord.fromDomain(record, cart.items().get());
    record.setCartItems(cartItemRecords);
    return record;
  }

  protected static Set<CartRecord> fromDomain(ClientRecord client, List<Cart> carts) {
    return carts.stream().map(cart -> fromDomain(client, cart)).collect(Collectors.toSet());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    CartRecord that = (CartRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
