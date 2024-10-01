/* (C)2024 */
package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UserIdDto.class)
@JsonSerialize(as = UserIdDto.class)
@ImmutableExt
public abstract class AbstractUserIdDto extends PrimitiveVo<String> {}
