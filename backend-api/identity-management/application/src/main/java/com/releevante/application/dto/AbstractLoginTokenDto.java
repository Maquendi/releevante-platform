package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LoginTokenDto.class)
@JsonSerialize(as = LoginTokenDto.class)
@ImmutableExt
public abstract class AbstractLoginTokenDto extends PrimitiveVo<String> {}
