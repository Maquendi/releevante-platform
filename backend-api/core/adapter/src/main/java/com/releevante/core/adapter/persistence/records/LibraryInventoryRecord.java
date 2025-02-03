package com.releevante.core.adapter.persistence.records;

import com.releevante.core.adapter.persistence.dao.projections.BookCopyProjection;
import com.releevante.core.domain.*;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "library_inventories", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class LibraryInventoryRecord extends PersistableEntity {
  @Column("cpy")
  @Id
  private String id;

  private String isbn;
  private String slid;
  private boolean isSync;
  private String status;
  private int usageCount;

  public static LibraryInventoryRecord updateFrom(
      SequentialGenerator<ZonedDateTime> generator, LoanItem item) {
    var record = new LibraryInventoryRecord();
    record.setNew(false);
    record.setUpdatedAt(generator.next());
    return record;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    LibraryInventoryRecord that = (LibraryInventoryRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  public static LibraryInventoryRecord fromDomain(BookCopy bookCopy) {
    var record = new LibraryInventoryRecord();
    record.setId(bookCopy.id());
    record.setIsbn(bookCopy.isbn().value());
    record.setSlid(bookCopy.slid().value());
    record.setStatus(bookCopy.status().name());
    record.setCreatedAt(bookCopy.createdAt());
    record.setUpdatedAt(bookCopy.updatedAt());
    record.setSync(bookCopy.isSync());
    record.setUsageCount(bookCopy.usageCount());
    return record;
  }

  public static LibraryInventoryRecord fromDomain(LibraryInventory inventory) {
    var record = new LibraryInventoryRecord();
    record.setId(inventory.id());
    record.setIsbn(inventory.isbn());
    record.setSlid(inventory.slid());
    record.setStatus(inventory.status().name());
    record.setCreatedAt(inventory.createdAt());
    record.setUpdatedAt(inventory.updatedAt());
    record.setSync(inventory.isSync());
    record.setUsageCount(inventory.usageCount());
    return record;
  }

  public static BookCopy fromProjection(BookCopyProjection projection) {
    return BookCopy.builder()
        .id(projection.getCpy())
        .isbn(Isbn.of(projection.getIsbn()))
        .slid(Slid.of(projection.getSlid()))
        .status(BookCopyStatus.valueOf(projection.getStatus()))
        .createdAt(projection.getCreatedAt())
        .updatedAt(projection.getUpdatedAt())
        .title(projection.getTitle())
        .author(projection.getAuthor())
        .language(projection.getLang())
        .correlationId(projection.getCorrelationId())
        .description(projection.getDescription())
        .isSync(projection.isSync())
        .descriptionFr(projection.getDescriptionFr())
        .descriptionSp(projection.getDescriptionEs())
        .price(projection.getPrice())
        .usageCount(projection.getUsageCount())
        .build();
  }
}
