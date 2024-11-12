package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.LazyLoaderInit;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.Slid;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "smart_libraries", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SmartLibraryRecord {
  @Id private String slid;

  private String orgId;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "library")
  private Set<SmartLibraryEventRecord> libraryEvents = new LinkedHashSet<>();

  public static SmartLibraryRecord fromDomain(SmartLibrary smartLibrary) {
    var record = new SmartLibraryRecord();

    record.setSlid(smartLibrary.id().value());
    record.setCreatedAt(smartLibrary.createdAt());
    record.setUpdatedAt(smartLibrary.updatedAt());
    record.setOrgId(smartLibrary.orgId().value());

    return record;
  }

  public static SmartLibraryRecord events(SmartLibrary smartLibrary) {
    var record = fromDomain(smartLibrary);
    var events = SmartLibraryEventRecord.fromDomain(record, smartLibrary.statuses().get());
    record.getLibraryEvents().addAll(events);

    return record;
  }

  public SmartLibrary toDomain() {
    return SmartLibrary.builder()
        .id(Slid.of(slid))
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .statuses(new LazyLoaderInit<>(() -> SmartLibraryEventRecord.toDomain(getLibraryEvents())))
        .build();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SmartLibraryRecord that = (SmartLibraryRecord) o;
    return Objects.equals(slid, that.slid);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
