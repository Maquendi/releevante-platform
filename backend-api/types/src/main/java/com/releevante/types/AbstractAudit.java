package com.releevante.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Audit.class)
@JsonSerialize(as = Audit.class)
@ImmutableExt
public abstract class AbstractAudit implements Auditable {}
