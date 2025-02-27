package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.identity.model.*;
import java.time.ZonedDateTime;
import java.util.Optional;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "smart_library_access_ctrl", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class SmartLibraryAccessControlRecord extends AuditableEntityFull {
  @Id private String id;
  private String slid;
  private String orgId;
  private String credential;
  private String contactLessId;
  private String accessId;
  private boolean isActive;
  private boolean isSynced;
  private ZonedDateTime expiresAt;

  public static SmartLibraryAccessControlRecord fromDomain(SmartLibraryAccess access) {
    var record = new SmartLibraryAccessControlRecord();
    record.setId(access.id());
    record.setSlid(access.slid());
    record.setActive(access.isActive());
    record.setCreatedAt(access.createdAt());
    record.setUpdatedAt(access.updatedAt());
    access.credential().ifPresent(record::setCredential);
    access.contactLessId().ifPresent(record::setContactLessId);
    record.setAccessId(access.accessId());
    record.setExpiresAt(access.expiresAt());
    record.setOrgId(access.orgId());
    record.setSynced(access.isSync());
    record.setAudit(access.audit());
    record.setOrigin(access.origin());
    return record;
  }

  public SmartLibraryAccess toDomain() {
    return SmartLibraryAccess.builder()
        .id(id)
        .slid(slid)
        .isActive(isActive)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .expiresAt(expiresAt)
        .accessId(accessId)
        .orgId(orgId)
        .contactLessId(Optional.ofNullable(contactLessId))
        .isSync(isSynced)
        .credential(Optional.ofNullable(credential))
        .audit(audit)
        .origin(origin)
        .build();
  }
}
