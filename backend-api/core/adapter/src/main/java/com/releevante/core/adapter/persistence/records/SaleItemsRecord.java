package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "sale_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SaleItemsRecord {
  @Id private String id;
  private String loan_id;
  private String isbn;
  private String cpy;
  private BigDecimal price;
  private String saleId;
}
