/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.records;

import com.releevante.identity.domain.model.M2MClient;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "auth_clients", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class M2MClientRecord {
  @Id private String id;
  private String secret;
  private String orgId;

  public M2MClient toDomain() {
    return M2MClient.builder().clientId(id).clientSecret(secret).orgId(orgId).build();
  }
}
