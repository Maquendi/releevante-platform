package com.releevante.core.adapter.persistence.records;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class AuditableEntity extends WithOrigin {
  protected String audit;
}
