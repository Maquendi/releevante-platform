package com.releevante.core.domain.identity.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccessCredentialKey.class)
@JsonSerialize(as = AccessCredentialKey.class)
@ImmutableExt
public abstract class AbstractAccessCredentialKey extends PrimitiveVo<String> {}
