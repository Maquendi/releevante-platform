package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.LazyLoaderInit;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.Slid;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
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

  private String modelName;

  private ZonedDateTime makeDate;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  private String orgId;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "library")
  private Set<SmartLibraryEventRecord> libraryEvents = new LinkedHashSet<>();

  public SmartLibrary toDomain() {
    return SmartLibrary.builder()
        .id(Slid.of(slid))
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .statuses(new LazyLoaderInit<>(() -> SmartLibraryEventRecord.toDomain(getLibraryEvents())))
        .build();
  }
}
