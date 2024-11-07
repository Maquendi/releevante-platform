package com.releevante.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UserId.class)
@JsonSerialize(as = UserId.class)
@ImmutableExt
public abstract class AbstractUserId extends PrimitiveVo<String> {}
