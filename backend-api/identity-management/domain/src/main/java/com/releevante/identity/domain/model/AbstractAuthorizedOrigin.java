package com.releevante.identity.domain.model;

import com.releevante.types.ImmutableObjectNoBuilder;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableObjectNoBuilder
public abstract class AbstractAuthorizedOrigin extends PrimitiveVo<String> {}
