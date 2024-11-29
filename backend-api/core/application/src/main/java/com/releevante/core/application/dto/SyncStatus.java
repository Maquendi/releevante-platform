package com.releevante.core.application.dto;

public enum SyncStatus {
  synced,
  not_synced;

  public boolean toBoolean() {
    return this == synced;
  }
}
