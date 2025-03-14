package com.releevante.types;

import java.time.ZonedDateTime;

public interface Auditable extends FromOrigin {
  String audit();

  ZonedDateTime createdAt();
}
