package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Objects;
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

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    OrgRecord that = (OrgRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
