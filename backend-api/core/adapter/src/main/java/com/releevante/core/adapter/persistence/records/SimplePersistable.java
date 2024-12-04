package com.releevante.core.adapter.persistence.records;

import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;

@Getter
@Setter
public abstract class SimplePersistable implements Persistable<String> {
  @Transient protected boolean isNew = true;
  protected ZonedDateTime createdAt;
}
