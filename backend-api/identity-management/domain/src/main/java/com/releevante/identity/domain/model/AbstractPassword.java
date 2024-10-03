/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import com.releevante.types.exceptions.InvalidInputException;
import java.util.regex.Pattern;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Password.class)
@JsonSerialize(as = Password.class)
@ImmutableExt
public abstract class AbstractPassword extends PrimitiveVo<String> {
  static final String VALIDATE_REGEX =
      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!*@#$%^&+=])(?=\\S+$).{8,}$";

  public static Password from(String rawPassword, PasswordEncoder encoder) {
    // validate password comply with rules.
    if (isValidPassword(rawPassword)) {
      return Password.of(encoder.encode(rawPassword));
    }
    throw new InvalidInputException("Invalid Password");
  }

  public static boolean isValidPassword(String password) {
    Pattern pattern = Pattern.compile(VALIDATE_REGEX);
    return pattern.matcher(password).matches();
  }
}
