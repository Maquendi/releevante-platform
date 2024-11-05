package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookSale;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.SaleId;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_sale", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookSaleRecord {
  @Column(name = "sale_id")
  @Id
  private String id;

  @OneToOne private CartRecord cart;
  private BigDecimal total;
  private String clientId;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  public BookSale toDomain() {
    return BookSale.builder()
        .id(SaleId.of(id))
        .total(total)
        .clientId(ClientId.of(clientId))
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .cart(getCart().toDomain())
        .build();
  }

  public static BookSaleRecord fromDomain(BookSale sale) {
    var record = new BookSaleRecord();
    record.setId(sale.id().value());
    record.setTotal(sale.total());
    record.setClientId(sale.clientId().value());
    record.setCreatedAt(sale.createdAt());
    record.setUpdatedAt(sale.updatedAt());
    record.setCart(CartRecord.fromDomain(sale.cart()));
    return record;
  }
}
