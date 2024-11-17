package com.releevante.identity.adapter.persistence.records;

import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;

public abstract class PersistableEntity implements Persistable<String> {

  @Transient private boolean isNew = true;

  @Override
  public boolean isNew() {
    return isNew;
  }

  public void setIsNew(boolean isNew) {
    this.isNew = isNew;
  }
}
