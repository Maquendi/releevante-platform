/* (C)2024 */
package com.releevante.identity.adapter.out.persistence.records;

import com.releevante.identity.domain.model.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Table(name = "accounts", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class AccountRecord {
  @Id private String id;
  private String userName;
  private String passwordHash;
  private boolean isActive;
  private String orgId;

  @JdbcTypeCode(SqlTypes.ARRAY)
  private List<String> roles;

  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  public LoginAccount toDomain() {
    return LoginAccount.builder()
        .accountId(AccountId.of(id))
        .userName(UserName.of(userName))
        .password(Password.of(passwordHash))
        .roles(roles.stream().map(Role::of).collect(Collectors.toList()))
        .orgId(OrgId.of(orgId))
        .isActive(isActive)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .build();
  }

  public static AccountRecord fromDomain(LoginAccount account) {
    var record = new AccountRecord();
    record.setId(account.accountId().value());
    record.setUserName(account.userName().value());
    record.setPasswordHash(account.password().value());
    record.setActive(account.isActive());
    record.setOrgId(account.orgId().value());
    record.setRoles(account.roles().stream().map(Role::value).toList());
    record.setCreatedAt(account.createdAt());
    record.setUpdatedAt(account.updatedAt());
    return record;
  }
}
