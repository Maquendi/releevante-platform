package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookCopy;
import com.releevante.core.domain.BookCopyStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "library_inventories", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class LibraryInventoryRecord {
  @Id private String cpy;
  private String isbn;
  private String slid;
  private boolean isSync;
  private BigDecimal price;
  private String status;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    LibraryInventoryRecord that = (LibraryInventoryRecord) o;
    return Objects.equals(cpy, that.cpy);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  protected static LibraryInventoryRecord fromDomain(BookCopy bookCopy) {
    var record = new LibraryInventoryRecord();
    record.setCpy(bookCopy.id().value());
    record.setIsbn(bookCopy.isbn().value());
    record.setSlid(bookCopy.slid().value());
    record.setStatus(bookCopy.status().name());
    record.setCreatedAt(bookCopy.createdAt());
    record.setUpdatedAt(bookCopy.updatedAt());
    return record;
  }
}
