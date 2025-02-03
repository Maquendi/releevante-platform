package com.releevante.types.utils;

import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;

public class DateTimeUtils {
  public static int daysDifference(ZonedDateTime time1, ZonedDateTime time2) {

    var lesser = time1;
    var greater = time2;

    if (lesser.isAfter(greater)) {
      greater = lesser;
      lesser = greater;
    }

    return 1;
  }

  public static ZonedDateTime daysToAdd(Integer plusDays) {

    return ZonedDateTimeGenerator.instance().next().plusDays(plusDays);
  }
}
