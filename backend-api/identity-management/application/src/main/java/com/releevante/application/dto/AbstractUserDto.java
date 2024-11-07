/* (C)2024 */
package com.releevante.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = UserDto.class)
@JsonSerialize(as = UserDto.class)
@ImmutableExt
public abstract class AbstractUserDto {
  abstract Optional<String> firstName();

  abstract Optional<String> lastName();

  abstract Optional<String> email();

  abstract Optional<String> phoneNumber();

  abstract AccountIdDto accountI();
}
