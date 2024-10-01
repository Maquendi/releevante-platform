/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.records;

import com.releevante.identity.domain.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "users", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class UserRecord {
  @Id private String id;
  private String nfcHash;
  private String fullName;
  private String accountId;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  public static UserRecord from(User user) {
    var record = new UserRecord();
    record.setId(user.id());
    record.setNfcHash(user.nfcHash());
    record.setFullName(user.fullName());
    record.setAccountId(user.accountId().value());
    record.setCreatedAt(user.createdAt());
    record.setUpdatedAt(user.updatedAt());
    return record;
  }
}
