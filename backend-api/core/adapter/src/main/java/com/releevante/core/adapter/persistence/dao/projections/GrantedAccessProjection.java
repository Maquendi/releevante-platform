package com.releevante.core.adapter.persistence.dao.projections;

import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrantedAccessProjection {
  private String id;
  private String credential;
  private String contactLessId;
  private String orgId;
  private boolean isActive;
  private ZonedDateTime expiresAt;
  private String slid;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;
  private String audit;
  private String origin;

  public SmartLibraryAccess toDomain() {
    return SmartLibraryAccess.builder()
        .id(id)
        .isActive(isActive)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .expiresAt(expiresAt)
        .orgId(orgId)
        .slid(List.of(slid))
        .contactLessId(Optional.ofNullable(contactLessId))
        .credential(Optional.ofNullable(credential))
        .audit(audit)
        .origin(origin)
        .build();
  }
}
