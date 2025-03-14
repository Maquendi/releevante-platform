/* (C)2024 */
package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.identity.model.AccountId;
import com.releevante.core.domain.identity.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "users", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class UserRecord extends PersistableEntity {
  @Id private String id;
  private String fullName;
  private String email;
  private String phoneNumber;

  public static UserRecord from(User user) {
    var record = new UserRecord();
    record.setId(user.id().value());
    record.setFullName(user.fullName());
    record.setCreatedAt(user.createdAt());
    record.setUpdatedAt(user.updatedAt());
    record.setEmail(user.email());
    record.setPhoneNumber(user.phone());
    return record;
  }

  public User toDomain() {
    return User.builder()
        .id(AccountId.of(id))
        .fullName(fullName)
        .email(email)
        .phone(phoneNumber)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .build();
  }
}
