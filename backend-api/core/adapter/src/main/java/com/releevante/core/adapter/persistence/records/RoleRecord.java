/* (C)2024 */
package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.identity.model.Privilege;
import com.releevante.core.domain.identity.model.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "roles", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class RoleRecord extends PersistableEntity {
  @Id private String id;
  private String role;
  private String privilege;

  public Privilege toPrivilege() {
    return Privilege.of(privilege);
  }

  public Role toRole() {
    return Role.of(role);
  }
}
