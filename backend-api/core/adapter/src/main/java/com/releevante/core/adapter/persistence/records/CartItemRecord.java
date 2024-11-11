package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.CartItem;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "cart_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class CartItemRecord {
  @Id private String id;

  @OneToOne(fetch = FetchType.LAZY)
  private BookRecord book;

  private BigDecimal itemPrice;
  private Integer qty;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private CartRecord cart;

  public CartItem toDomain() {
    return CartItem.builder()
        .id(id)
        .qty(qty)
        .createdAt(createdAt)
        .book(() -> getBook().toDomain())
        .itemPrice(getItemPrice())
        .build();
  }

  public static CartItemRecord fromDomain(CartItem cartItem) {
    var record = new CartItemRecord();
    record.setId(cartItem.id());
    record.setCreatedAt(cartItem.createdAt());
    record.setBook(BookRecord.fromDomain(cartItem.book().get()));
    record.setQty(cartItem.qty());
    record.setItemPrice(cartItem.itemPrice());
    return record;
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
