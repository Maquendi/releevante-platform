/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.ImmutableExt;
import java.util.List;
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

  abstract boolean isActive();

  abstract OrgId orgId();

  public LoginAccount validPasswordOrThrow(Password rawPassword, PasswordEncoder encoder) {
    var password = rawPassword.value();
    var encoded = encoder.encode(password);
    if (encoded.equals(password().value())) {
      return (LoginAccount) this;
    }
    throw new RuntimeException("Invalid credentials");
  }

  public boolean hasAuthorities(String... authorities) {
    return true;
  }

  public void checkIsActive() {
    if (!this.isActive()) {
      throw new RuntimeException("");
    }
  }

  public boolean hasAnyAuthority(String... authorities) {

    //        return Arrays.stream(authorities)
    //                .map()

    return true;
  }

  public boolean hasAuthority(String authority) {
    return true;
  }

  public LoginAccount checkHasAuthority(String authority) {
    checkIsActive();
    if (!hasAuthority(authority)) {
      throw new RuntimeException();
    }
    return (LoginAccount) this;
  }
}
