package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccessCredentialValue.class)
@JsonSerialize(as = AccessCredentialValue.class)
@ImmutableExt
public abstract class AbstractAccessCredentialValue extends PrimitiveVo<String> {}
