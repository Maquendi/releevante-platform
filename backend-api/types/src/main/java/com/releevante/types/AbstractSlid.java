package com.releevante.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Slid.class)
@JsonSerialize(as = Slid.class)
@ImmutableExt
public abstract class AbstractSlid extends PrimitiveVo<String> {}
