package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "smart_library_book_inventory", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SmartLibraryBookInventoryRecord {
  @Id private String id;
  private String bookCopy;
  private String slid;
  private String isbn;
  private boolean isSync;
  private boolean isActive;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SmartLibraryBookInventoryRecord that = (SmartLibraryBookInventoryRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
