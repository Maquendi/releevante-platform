/* (C)2024 */
package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccountDto.class)
@JsonSerialize(as = AccountDto.class)
@ImmutableExt
public abstract class AbstractAccountDto {

  abstract String userName();

  abstract String password();

  // abstract String orgId();
}
