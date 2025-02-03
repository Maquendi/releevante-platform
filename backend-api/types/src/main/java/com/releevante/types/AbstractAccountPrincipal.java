/* (C)2024 */
package com.releevante.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.exceptions.ForbiddenException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccountPrincipal.class)
@JsonSerialize(as = AccountPrincipal.class)
@ImmutableExt
public abstract class AbstractAccountPrincipal {
  abstract String orgId();

  abstract String audience();

  abstract String subject();

  abstract List<String> roles();

  public boolean isSuperAdmin() {
    return roles().stream().anyMatch(role -> role.equals(AUTHORITIES.SUPER_ADMIN.getAuthority()));
  }

  public void checkHasAnyAuthority(String... authorities) {
    var privileges = new ArrayList<>(Arrays.asList(authorities));
    privileges.add(AUTHORITIES.SUPER_ADMIN.getAuthority());
    if (privileges.stream().noneMatch(this::hasAuthority)) {
      throw new ForbiddenException();
    }
  }

  public boolean hasAuthority(String authority) {
    return roles().stream().anyMatch(authority::equals);
  }
}
