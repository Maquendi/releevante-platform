package com.releevante.asset.mgmt.application.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SlidDto.class)
@JsonSerialize(as = SlidDto.class)
@ImmutableExt
public abstract class AbstractSlidDto extends PrimitiveVo<String> {}
