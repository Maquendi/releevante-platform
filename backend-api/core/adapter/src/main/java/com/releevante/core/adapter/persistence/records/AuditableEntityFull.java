package com.releevante.core.adapter.persistence.records;

import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class AuditableEntityFull extends PersistableRecord {
  protected String audit;
  protected String origin;
  protected ZonedDateTime createdAt;
  protected ZonedDateTime updatedAt;
}
