/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.ImmutableExt;
import com.releevante.types.exceptions.ConfigurationException;
import com.releevante.types.exceptions.ForbiddenException;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoginAccount.class)
@JsonSerialize(as = LoginAccount.class)
@ImmutableExt
public abstract class AbstractLoginAccount {
  static final String SUPER_ADMIN_AUTHORITY = "super-admin";

  abstract AccountId accountId();

  abstract UserName userName();

  abstract Email email();

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
    throw new UserUnauthorizedException();
  }

  public LoginAccount checkIsActive() {
    if (!this.isActive()) {
      throw new ConfigurationException("Account configuration");
    }
    return (LoginAccount) this;
  }

  public LoginAccount checkHasAnyAuthority(String... authorities) {
    checkIsActive();
    var privileges = new ArrayList<>(Arrays.asList(authorities));
    privileges.add(SUPER_ADMIN_AUTHORITY);
    if (privileges.stream().noneMatch(this::hasAuthority)) {
      throw new ForbiddenException();
    }
    return (LoginAccount) this;
  }

  public boolean hasAuthority(String authority) {
    return privileges().stream().anyMatch(authority::equals);
  }
}
