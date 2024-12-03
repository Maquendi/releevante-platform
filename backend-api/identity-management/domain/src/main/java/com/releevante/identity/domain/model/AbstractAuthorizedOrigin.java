package com.releevante.identity.domain.model;

import com.releevante.types.ImmutableObject;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableObject
public abstract class AbstractAuthorizedOrigin {

  abstract String id();

  abstract String type();

  abstract String orgId();

  abstract boolean isActive();
}
