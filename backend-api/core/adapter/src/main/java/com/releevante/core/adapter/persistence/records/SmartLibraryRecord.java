package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.SmartLibrary;
import java.util.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "smart_libraries", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class SmartLibraryRecord extends PersistableEntity {
  @Column("slid")
  @Id
  private String id;

  private String modelName;

  @Transient private Set<SmartLibraryEventRecord> libraryEvents = new HashSet<>();

  public static SmartLibraryRecord fromDomain(SmartLibrary smartLibrary) {
    var record = new SmartLibraryRecord();
    record.setId(smartLibrary.id().value());
    record.setCreatedAt(smartLibrary.createdAt());
    record.setUpdatedAt(smartLibrary.updatedAt());
    record.setModelName(smartLibrary.modelName());
    return record;
  }

  public static SmartLibraryRecord events(SmartLibrary smartLibrary) {
    var record = fromDomain(smartLibrary);
    var events = SmartLibraryEventRecord.fromDomain(record, smartLibrary.statuses());
    record.getLibraryEvents().addAll(events);
    return record;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SmartLibraryRecord that = (SmartLibraryRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
