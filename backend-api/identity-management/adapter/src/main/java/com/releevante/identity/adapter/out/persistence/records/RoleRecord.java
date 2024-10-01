/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.records;

import com.releevante.identity.domain.model.Privilege;
import com.releevante.identity.domain.model.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "roles", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
@IdClass(RolesPrivilegePK.class)
@Entity
public class RoleRecord {
  @Id private String role;
  @Id private String privilege;

  public Privilege toPrivilege() {
    return Privilege.of(privilege);
  }

  public Role toRole() {
    return Role.of(role);
  }
}
