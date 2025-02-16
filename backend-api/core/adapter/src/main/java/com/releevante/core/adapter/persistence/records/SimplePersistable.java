package com.releevante.core.adapter.persistence.records;

import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class SimplePersistable extends PersistableRecord {
  protected ZonedDateTime createdAt;
}
