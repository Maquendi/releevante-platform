package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.identity.model.Organization;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "org", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class OrgRecord extends PersistableEntity {
  @Id private String id;
  private String name;
  private String type;
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
