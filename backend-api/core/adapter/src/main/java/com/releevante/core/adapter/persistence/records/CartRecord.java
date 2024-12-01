package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.*;
import com.releevante.types.Slid;
import com.releevante.types.UserId;
import java.util.*;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "carts", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class CartRecord extends PersistableEntity {
  @Id private String id;
  private String userId;
  private String state;
  private String slid;

  @Transient private Set<CartItemRecord> cartItems = new HashSet<>();

  public static CartRecord from(Cart cart) {
    var record = new CartRecord();
    record.setId(cart.id().value());
    record.setUserId(cart.userId().value());
    record.setState(cart.state().value());
    record.setCreatedAt(cart.createAt());
    record.setUpdatedAt(cart.updatedAt());
    var cartItemRecords = CartItemRecord.fromDomain(record, cart.items());
    record.setCartItems(cartItemRecords);
    record.setSlid(cart.slid().map(Slid::value).orElse(null));
    return record;
  }

  public Cart toDomain() {
    return Cart.builder()
        .id(CartId.of(id))
        .state(CartState.of(state))
        .items(getCartItems().stream().map(CartItemRecord::toDomain).collect(Collectors.toList()))
        .updatedAt(updatedAt)
        .createAt(createdAt)
        .userId(UserId.of(userId))
        .slid(Optional.ofNullable(slid).map(Slid::of))
        .build();
  }

  protected static CartRecord fromDomain(ClientRecord client, Cart cart) {
    var record = new CartRecord();
    record.setId(cart.id().value());
    record.setUserId(client.getId());
    record.setState(cart.state().value());
    record.setCreatedAt(cart.createAt());
    record.setUpdatedAt(cart.updatedAt());
    var cartItemRecords = CartItemRecord.fromDomain(record, cart.items());
    record.setCartItems(cartItemRecords);
    record.setSlid(cart.slid().map(Slid::value).orElse(null));
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
