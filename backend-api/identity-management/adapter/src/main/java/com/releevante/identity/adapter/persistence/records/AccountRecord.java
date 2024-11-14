/* (C)2024 */
package com.releevante.identity.adapter.persistence.records;

import com.releevante.identity.domain.model.*;
import java.time.ZonedDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "accounts", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
public class AccountRecord {
  @Id private String id;
  private String userName;
  private String passwordHash;
  private String email;
  private boolean isActive;
  private String orgId;

  private Set<String> roles;

  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;

  public LoginAccount toDomain() {
    return LoginAccount.builder()
        .accountId(AccountId.of(id))
        .userName(UserName.of(userName))
        .password(Password.of(passwordHash))
        .roles(roles.stream().map(Role::of).collect(Collectors.toList()))
        .orgId(OrgId.of(orgId))
        .email(Email.of(email))
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
    record.setRoles(account.roles().stream().map(Role::value).collect(Collectors.toSet()));
    record.setCreatedAt(account.createdAt());
    record.setUpdatedAt(account.updatedAt());
    record.setEmail(account.email().value());
    return record;
  }
}
