/* (C)2024 */
package com.releevante.core.domain.identity.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccountId.class)
@JsonSerialize(as = AccountId.class)
@ImmutableExt
public abstract class AbstractAccountId extends PrimitiveVo<String> {}
