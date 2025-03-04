package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import java.time.ZonedDateTime;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "granted_access", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class GrantedAccessRecord extends AuditableEntityFull {
  @Id private String id;
  private String credential;
  private String contactLessId;
  private String orgId;
  private boolean isActive;
  private ZonedDateTime expiresAt;

  @Transient
  Set<SmartLibraryGrantedAccessRecord> smartLibraryGrantedAccessRecords = new LinkedHashSet<>();

  public static GrantedAccessRecord fromDomain(SmartLibraryAccess access) {
    var record = new GrantedAccessRecord();
    record.setId(access.id());
    record.setActive(access.isActive());
    record.setCreatedAt(access.createdAt());
    record.setUpdatedAt(access.updatedAt());
    access.credential().ifPresent(record::setCredential);
    access.contactLessId().ifPresent(record::setContactLessId);
    record.setExpiresAt(access.expiresAt());
    record.setOrgId(access.orgId());
    record.setAudit(access.audit());
    record.setOrigin(access.origin());
    record.setSmartLibraryGrantedAccessRecords(SmartLibraryGrantedAccessRecord.fromDomain(access));
    return record;
  }

  public SmartLibraryAccess toDomain() {
    return SmartLibraryAccess.builder()
        .id(id)
        .isActive(isActive)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .expiresAt(expiresAt)
        .orgId(orgId)
        .slid(
            smartLibraryGrantedAccessRecords.stream()
                .map(SmartLibraryGrantedAccessRecord::getSlid)
                .toList())
        .contactLessId(Optional.ofNullable(contactLessId))
        .credential(Optional.ofNullable(credential))
        .audit(audit)
        .origin(origin)
        .build();
  }
}
