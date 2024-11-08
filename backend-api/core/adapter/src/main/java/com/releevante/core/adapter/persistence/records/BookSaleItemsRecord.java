package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_sale_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookSaleItemsRecord {
  @Id private String id;

  @OneToOne(fetch = FetchType.EAGER)
  private BookRecord book;

  private BigDecimal price;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sale_id")
  private BookSaleRecord sale;
}
