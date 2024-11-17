package com.releevante.identity.adapter.persistence.records;

import com.releevante.identity.domain.model.*;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "smart_library_access_ctrl", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
public class SmartLibraryAccessRecord extends PersistableEntity{
  @Id private String id;
  private String orgId;
  private String slid;
  private String credential;
  private String credentialType;
  private boolean isActive;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  public static SmartLibraryAccessRecord fromDomain(SmartLibraryAccess access) {
    var record = new SmartLibraryAccessRecord();
    record.setId(access.id());
    record.setSlid(access.slid());
    record.setActive(access.isActive());
    record.setCreatedAt(access.createdAt());
    record.setUpdatedAt(access.updatedAt());
    record.setOrgId(access.orgId().value());
    record.setCredential(access.credential().value().value());
    record.setCredentialType(access.credential().key().value());
    return record;
  }

  public SmartLibraryAccess toDomain() {
    return SmartLibraryAccess.builder()
        .id(id)
        .orgId(OrgId.of(orgId))
        .slid(slid)
        .isActive(isActive)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .credential(
            AccessCredential.builder()
                .value(AccessCredentialValue.of(credential))
                .key(AccessCredentialKey.of(credentialType))
                .build())
        .build();
  }
}
