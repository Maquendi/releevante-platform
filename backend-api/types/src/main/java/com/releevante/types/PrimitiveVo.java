/* (C)2023 */
package com.releevante.types;

import com.fasterxml.jackson.annotation.JsonValue;
import org.immutables.value.Value.Parameter;

public abstract class PrimitiveVo<E> {
  public PrimitiveVo() {}

  @JsonValue
  @Parameter
  public abstract E value();

  public String toString() {
    return this.value().toString();
  }
}
