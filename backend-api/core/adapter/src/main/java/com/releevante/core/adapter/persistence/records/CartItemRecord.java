package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.CartItem;
import com.releevante.types.BookCopyId;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;
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
  private String bookId;
  @OneToOne
  private BookEditionRecord edition;
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
        .bookCopyId(Optional.ofNullable(bookId).map(BookCopyId::of))
        .bookEdition(getEdition().toDomain())
        .itemPrice(getItemPrice())
        .build();
  }

  public static CartItemRecord fromDomain(CartItem cartItem) {
    var record = new CartItemRecord();
    record.setId(cartItem.id());
    record.setCreatedAt(cartItem.createdAt());
    record.setBookId(cartItem.bookCopyId().map(BookCopyId::value).orElse(null));
    record.setEdition(BookEditionRecord.fromDomain(cartItem.bookEdition()));
    record.setQty(cartItem.qty());
    record.setItemPrice(cartItem.itemPrice());
    return record;
  }
}
