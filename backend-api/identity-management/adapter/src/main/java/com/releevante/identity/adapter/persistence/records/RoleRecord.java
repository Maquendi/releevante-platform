/* (C)2024 */
package com.releevante.identity.adapter.persistence.records;

import com.releevante.identity.domain.model.Privilege;
import com.releevante.identity.domain.model.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "roles", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
public class RoleRecord extends PersistableEntity {
  private String id;
  private String role;
  private String privilege;

  public Privilege toPrivilege() {
    return Privilege.of(privilege);
  }

  public Role toRole() {
    return Role.of(role);
  }
}
