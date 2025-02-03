package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.CartItem;
import com.releevante.core.domain.Isbn;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "cart_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class CartItemRecord extends PersistableEntity {
  @Id private String id;
  private String isbn;
  private Integer qty;
  private String cartId;
  private boolean forPurchase;

  public CartItem toDomain() {
    return CartItem.builder().id(id).qty(qty).isbn(Isbn.of(isbn)).forPurchase(forPurchase).build();
  }

  protected static CartItemRecord fromDomain(CartRecord cart, CartItem cartItem) {
    return fromDomain(cart.getId(), true, cartItem);
  }

  public static Set<CartItemRecord> fromDomain(CartRecord cart, List<CartItem> cartItems) {
    return cartItems.stream().map(item -> fromDomain(cart, item)).collect(Collectors.toSet());
  }

  public static Set<CartItemRecord> fromDomain(String cartId, List<CartItem> cartItems) {
    return cartItems.stream()
        .map(item -> fromDomain(cartId, true, item))
        .collect(Collectors.toSet());
  }

  protected static CartItemRecord fromDomain(String cartId, boolean isNew, CartItem cartItem) {
    var record = new CartItemRecord();
    record.setId(cartItem.id());
    record.setIsbn(cartItem.isbn().value());
    record.setQty(cartItem.qty());
    record.setCartId(cartId);
    record.setForPurchase(cartItem.forPurchase());
    record.setNew(isNew);
    return record;
  }

  public static Set<CartItemRecord> fromDomainForUpdate(String cartId, List<CartItem> cartItems) {
    return cartItems.stream()
        .map(item -> fromDomain(cartId, false, item))
        .collect(Collectors.toSet());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    CartItemRecord that = (CartItemRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
