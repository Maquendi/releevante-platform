package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.LazyLoaderInit;
import com.releevante.core.domain.OrgId;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
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

  private String orgId;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  @Transient private Set<SmartLibraryEventRecord> libraryEvents = new LinkedHashSet<>();

  public static SmartLibraryRecord fromDomain(SmartLibrary smartLibrary) {
    var record = new SmartLibraryRecord();

    record.setId(smartLibrary.id().value());
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
        .id(Slid.of(id))
        .orgId(OrgId.of(orgId))
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .statuses(new LazyLoaderInit<>(Collections::emptyList))
        .clients(Collections.emptyList())
        .build();
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
