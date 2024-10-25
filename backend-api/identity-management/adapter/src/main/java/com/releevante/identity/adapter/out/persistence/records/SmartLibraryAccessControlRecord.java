package com.releevante.identity.adapter.out.persistence.records;

import com.releevante.identity.domain.model.AccessCode;
import com.releevante.identity.domain.model.NfcUid;
import com.releevante.identity.domain.model.OrgId;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.Optional;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "smart_library_access_ctrl", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SmartLibraryAccessControlRecord {
  @Id private String id;
  private String orgId;
  private String slid; // smart library identifier.
  private String nfcHash;
  private String accessCode;
  private boolean isActive;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  public static SmartLibraryAccessControlRecord fromDomain(SmartLibraryAccess access) {
    var record = new SmartLibraryAccessControlRecord();
    record.setId(access.id());
    record.setSlid(access.slid());
    record.setActive(access.isActive());
    record.setCreatedAt(access.createdAt());
    record.setUpdatedAt(access.updatedAt());
    record.setOrgId(access.orgId().value());
    access.accessCode().map(AccessCode::value).ifPresent(record::setAccessCode);
    access.nfcHash().map(NfcUid::value).ifPresent(record::setNfcHash);
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
        .accessCode(Optional.ofNullable(accessCode).map(AccessCode::of))
        .nfcHash(Optional.ofNullable(nfcHash).map(NfcUid::of))
        .build();
  }
}
