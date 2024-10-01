/* (C)2023 */
package com.releevante.types;

import java.util.UUID;

public class UuidGenerator extends SequentialGenerator<String> {
  private UuidGenerator() {
    super("ignored", (previous) -> UUID.randomUUID().toString());
  }

  public static SequentialGenerator<String> instance() {
    return new UuidGenerator();
  }
}
