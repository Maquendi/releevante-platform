/* (C)2024 */
package com.releevante.identity.adapter.persistence.records;

import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class RolesPrivilegePK implements Serializable {
  private String role;
  private String privilege;
}
