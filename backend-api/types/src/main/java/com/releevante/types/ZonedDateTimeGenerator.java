/* (C)2023 */
package com.releevante.types;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

public class ZonedDateTimeGenerator extends SequentialGenerator<ZonedDateTime> {

  private static final ZonedDateTime zeroValue;

  private ZonedDateTimeGenerator(ZoneId zoneId) {
    super(zeroValue, (previous) -> ZonedDateTime.now().withZoneSameInstant(zoneId));
  }

  public static SequentialGenerator<ZonedDateTime> instance() {
    return instance(ZoneOffset.UTC);
  }

  public static SequentialGenerator<ZonedDateTime> instance(ZoneId zoneId) {
    return new ZonedDateTimeGenerator(zoneId);
  }

  static {
    zeroValue =
        ZonedDateTime.now()
            .withDayOfMonth(1)
            .withMonth(1)
            .withYear(1970)
            .withHour(0)
            .withMinute(0)
            .withSecond(0)
            .withNano(0)
            .withZoneSameLocal(ZoneOffset.UTC);
  }
}
