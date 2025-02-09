package com.releevante.core.adapter.persistence.dao.projections;

import com.releevante.core.domain.OrgId;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.core.domain.types.SmartLibraryState;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SmartLibraryProjection {
  String slid;
  String orgId;
  String modelName;
  int modules;
  int moduleCapacity;
  boolean isActive;
  ZonedDateTime createdAt;
  SmartLibraryState status;

  public SmartLibrary toDomain() {
    return SmartLibrary.builder()
        .id(Slid.of(slid))
        .updatedAt(createdAt)
        .createdAt(createdAt)
        .modelName(modelName)
        .orgId(OrgId.of(orgId))
        .modules(modules)
        .moduleCapacity(moduleCapacity)
        .isActive(isActive)
        .currentStatus(status)
        .build();
  }
}
