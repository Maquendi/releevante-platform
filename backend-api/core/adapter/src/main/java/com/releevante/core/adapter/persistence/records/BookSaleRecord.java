package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
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

  @OneToOne(fetch = FetchType.LAZY)
  @Column(name = "cart_id")
  private CartRecord cart;

  private BigDecimal total;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private ClientRecord client;

  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  public BookSale toDomain() {
    return BookSale.builder()
        .id(SaleId.of(id))
        .total(total)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .client(new LazyLoaderInit<>(() -> getClient().toDomain()))
        .cart(new LazyLoaderInit<>(() -> getCart().toDomain()))
        .build();
  }

  public static List<BookSale> toDomain(Set<BookSaleRecord> records) {
    return records.stream().map(BookSaleRecord::toDomain).collect(Collectors.toList());
  }

  protected static BookSaleRecord fromDomain(BookSale sale) {
    var record = new BookSaleRecord();
    record.setId(sale.id().value());
    record.setTotal(sale.total());
    record.setCreatedAt(sale.createdAt());
    record.setUpdatedAt(sale.updatedAt());
    record.setCart(CartRecord.fromDomain(sale.cart().get()));
    return record;
  }
}
