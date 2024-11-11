package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "org_library", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class OrgLibraryRecord {
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private OrgRecord org;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private SmartLibraryRecord library;

  private ZonedDateTime createdAt;

  private ZonedDateTime updatedAt;

  private boolean isActive;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    OrgLibraryRecord that = (OrgLibraryRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
