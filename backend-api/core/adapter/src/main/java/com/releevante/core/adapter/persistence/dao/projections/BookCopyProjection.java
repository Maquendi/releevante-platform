package com.releevante.core.adapter.persistence.dao.projections;

import java.math.BigDecimal;

public interface BookCopyProjection {
  String getCpy();

  String getIsbn();

  String getSlid();

  BigDecimal getBasePrice();

  BigDecimal getTotalPrice();

  String getTitle();
}
