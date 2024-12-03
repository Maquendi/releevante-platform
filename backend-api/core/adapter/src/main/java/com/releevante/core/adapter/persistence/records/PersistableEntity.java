package com.releevante.core.adapter.persistence.records;

import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class PersistableEntity extends SimplePersistable {
  protected ZonedDateTime updatedAt;
}
