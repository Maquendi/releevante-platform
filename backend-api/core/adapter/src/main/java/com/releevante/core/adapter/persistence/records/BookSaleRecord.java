package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.*;
import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_sales", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookSaleRecord extends PersistableEntity {
  @Id private String id;
  private BigDecimal total;
  private String clientId;

  @Transient private Set<SaleItemsRecord> saleItems = new LinkedHashSet<>();

  public BookSale toDomain() {
    return BookSale.builder()
        .id(SaleId.of(id))
        .total(total)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .build();
  }

  public static List<BookSale> toDomain(Set<BookSaleRecord> records) {
    return records.stream().map(BookSaleRecord::toDomain).collect(Collectors.toList());
  }

  private static BookSaleRecord fromDomain(ClientRecord client, BookSale sale) {
    var record = new BookSaleRecord();
    record.setId(sale.id().value());
    record.setTotal(sale.total());
    record.setCreatedAt(sale.createdAt());
    record.setUpdatedAt(sale.updatedAt());
    record.setClientId(client.getId());
    return record;
  }

  protected static Set<BookSaleRecord> fromDomain(ClientRecord client, List<BookSale> sales) {
    return sales.stream().map(sale -> fromDomain(client, sale)).collect(Collectors.toSet());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BookSaleRecord that = (BookSaleRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
