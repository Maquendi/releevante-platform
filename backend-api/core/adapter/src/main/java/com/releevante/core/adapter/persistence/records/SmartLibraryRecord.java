package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "org_id")
  private OrgRecord org;
}
