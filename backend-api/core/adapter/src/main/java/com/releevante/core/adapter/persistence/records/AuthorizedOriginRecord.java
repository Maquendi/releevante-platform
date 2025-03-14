package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.identity.model.AuthorizedOrigin;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "authorized_origins", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class AuthorizedOriginRecord extends PersistableEntity {
  @Id String id;
  String type;
  String orgId;
  String role;
  int sessionTtlHours;
  boolean isActive;

  public AuthorizedOrigin toDomain() {
    return AuthorizedOrigin.builder()
        .id(id)
        .isActive(isActive)
        .orgId(orgId)
        .type(type)
        .sessionTTlHour(sessionTtlHours)
        .role(role)
        .build();
  }
}
