/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.records;

import java.io.Serializable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RolesPrivilegePK implements Serializable {
  private String role;
  private String privilege;
}
