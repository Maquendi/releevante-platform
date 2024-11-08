package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.util.HashSet;
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
  @Id
  private String id;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "org")
  private Set<SmartLibraryRecord> smartLibraries = new LinkedHashSet<>();
}
