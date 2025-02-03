package com.releevante.core.adapter.persistence.records;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "sale_items", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class SaleItemsRecord extends PersistableEntity {
  @Id private String id;
  private String loan_id;
  private String isbn;
  private String cpy;
  private BigDecimal price;
  private String saleId;
}
