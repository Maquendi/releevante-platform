package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "smart_library_book_inventory", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SmartLibraryBookInventoryRecord {
  @Id private String bookId;
  private String slid;
  private String isbn;
  private boolean isSync;
  private boolean isActive;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;
}
