/* (C)2024 */
package com.releevante.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccountPrincipal.class)
@JsonSerialize(as = AccountPrincipal.class)
@ImmutableExt
public abstract class AbstractAccountPrincipal {
  abstract String orgId();

  abstract String subject();

  abstract String audience();

  abstract List<String> roles();
}
