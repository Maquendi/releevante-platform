package com.releevante.core.adapter.persistence.records;

import com.releevante.core.adapter.persistence.dao.projections.BookCopyData;
import com.releevante.core.adapter.persistence.dao.projections.BookCopyProjection;
import com.releevante.core.domain.BookCopy;
import com.releevante.core.domain.BookCopyStatus;
import com.releevante.core.domain.Isbn;
import com.releevante.types.BookCopyId;
import com.releevante.types.Slid;
import java.math.BigDecimal;
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
  private BigDecimal price;
  private String status;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

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

  protected static LibraryInventoryRecord fromDomain(BookCopy bookCopy) {
    var record = new LibraryInventoryRecord();
    record.setId(bookCopy.id().value());
    record.setIsbn(bookCopy.isbn().value());
    record.setSlid(bookCopy.slid().value());
    record.setStatus(bookCopy.status().name());
    record.setCreatedAt(bookCopy.createdAt());
    record.setUpdatedAt(bookCopy.updatedAt());
    record.setSync(bookCopy.isSync());
    return record;
  }

  public static BookCopy fromProjection(BookCopyProjection projection) {
    return BookCopy.builder()
        .id(BookCopyId.of(projection.getCpy()))
        .isbn(Isbn.of(projection.getIsbn()))
        .slid(Slid.of(projection.getSlid()))
        .status(BookCopyStatus.AVAILABLE)
        .createdAt(ZonedDateTime.now())
        .updatedAt(ZonedDateTime.now())
        .title(projection.getTitle())
        .isSync(false)
        .price(projection.getTotalPrice())
        .build();
  }

  public static BookCopy fromProjection(BookCopyData projection) {
    return BookCopy.builder()
        .id(BookCopyId.of(projection.getCpy()))
        .isbn(Isbn.of(projection.getIsbn()))
        .slid(Slid.of(projection.getSlid()))
        .status(BookCopyStatus.AVAILABLE)
        .createdAt(ZonedDateTime.now())
        .updatedAt(ZonedDateTime.now())
        .title(projection.getTitle())
        .isSync(false)
        .price(projection.getPrice())
        .build();
  }

  public BookCopy toDomain() {
    return BookCopy.builder()
        .id(BookCopyId.of(id))
        .isbn(Isbn.of(isbn))
        .slid(Slid.of(slid))
        .status(BookCopyStatus.valueOf(status))
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .isSync(isSync)
        .price(price)
        .build();
  }
}
