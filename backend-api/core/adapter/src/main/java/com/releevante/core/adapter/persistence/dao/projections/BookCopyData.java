package com.releevante.core.adapter.persistence.dao.projections;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookCopyData {
  private String cpy;
  private String isbn;
  private String slid;
  private BigDecimal price;
  private String title;
}
