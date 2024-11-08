package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "book_prices", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class BookPriceRecord {
  @Id private String id;
  private BigDecimal price;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "isbn")
  private BookRecord book;
}
