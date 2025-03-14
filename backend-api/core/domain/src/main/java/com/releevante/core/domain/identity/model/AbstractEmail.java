/* (C)2024 */
package com.releevante.core.domain.identity.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import com.releevante.types.exceptions.InvalidInputException;
import java.util.regex.Pattern;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Email.class)
@JsonSerialize(as = Email.class)
@ImmutableExt
public abstract class AbstractEmail extends PrimitiveVo<String> {
  static final String VALIDATE_REGEX =
      "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,7}$";

  public static Email from(String email) {
    // validate email comply with rules.
    if (isValidEmail(email)) {
      return Email.of(email);
    }
    throw new InvalidInputException("Invalid Email");
  }

  public static boolean isValidEmail(String email) {
    Pattern pattern = Pattern.compile(VALIDATE_REGEX);
    return pattern.matcher(email).matches();
  }
}
