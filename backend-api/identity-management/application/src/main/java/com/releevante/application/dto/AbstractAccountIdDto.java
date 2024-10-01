/* (C)2024 */
package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccountIdDto.class)
@JsonSerialize(as = AccountIdDto.class)
@ImmutableExt
public abstract class AbstractAccountIdDto extends PrimitiveVo<String> {}
