package com.releevante.identity.adapter.out.persistence.records;

import com.releevante.identity.domain.model.OrgId;
import com.releevante.identity.domain.model.Organization;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "org", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class OrgRecord {
  @Id private String id;
  private String name;
  private String type;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;
  private boolean isActive;

  public static OrgRecord from(Organization domain) {
    var org = new OrgRecord();
    org.setId(domain.id().value());
    org.setName(domain.name());
    org.setType(domain.type());
    org.setCreatedAt(domain.createdAt());
    org.setUpdatedAt(domain.updatedAt());
    return org;
  }

  public Organization toDomain() {
    return Organization.builder()
        .id(OrgId.of(id))
        .type(type)
        .updatedAt(updatedAt)
        .createdAt(createdAt)
        .name(name)
        .isActive(isActive)
        .build();
  }
}
