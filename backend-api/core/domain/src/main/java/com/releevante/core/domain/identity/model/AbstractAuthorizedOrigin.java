package com.releevante.core.domain.identity.model;

import com.releevante.types.ImmutableObject;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableObject
public abstract class AbstractAuthorizedOrigin {

  abstract String id();

  abstract String type();

  abstract String orgId();

  abstract int sessionTTlHour();

  abstract boolean isActive();

  abstract String role();
}
