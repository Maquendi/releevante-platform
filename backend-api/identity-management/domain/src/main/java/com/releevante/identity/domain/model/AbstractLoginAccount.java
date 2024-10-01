/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoginAccount.class)
@JsonSerialize(as = LoginAccount.class)
@ImmutableExt
public abstract class AbstractLoginAccount {
  abstract AccountId accountId();

  abstract UserName userName();

  abstract Password password();

  abstract List<Role> roles();

  abstract List<String> permissions();

  abstract boolean isActive();

  abstract OrgId orgId();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  public List<String> privileges() {
    var collections = roles().stream().map(Role::value).collect(Collectors.toList());
    collections.addAll(permissions());
    return collections;
  }

  public LoginAccount validPasswordOrThrow(Password rawPassword, PasswordEncoder encoder) {
    if (encoder.validate(rawPassword.value(), password().value())) {
      return (LoginAccount) this;
    }
    throw new RuntimeException("Invalid credentials");
  }

  public boolean hasAuthorities(String... authorities) {
    return true;
  }

  public LoginAccount checkIsActive() {
    if (!this.isActive()) {
      throw new RuntimeException("account not configured");
    }
    return (LoginAccount) this;
  }

  public boolean hasAnyAuthority(String... authorities) {
    return true;
  }

  public boolean hasAuthority(String authority) {
    return true;
  }

  public LoginAccount checkHasAuthority(String authority) {
    checkIsActive();
    if (!hasAuthority(authority)) {
      throw new RuntimeException("insufficient privilege");
    }
    return (LoginAccount) this;
  }
}
