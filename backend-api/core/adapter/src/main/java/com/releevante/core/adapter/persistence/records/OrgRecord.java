package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "org", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class OrgRecord {
  @Id private String id;
  private String name;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "org")
  private Set<OrgLibraryRecord> smartLibraries = new LinkedHashSet<>();
}
