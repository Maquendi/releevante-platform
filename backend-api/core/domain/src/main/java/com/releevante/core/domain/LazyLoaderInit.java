package com.releevante.core.domain;

public class LazyLoaderInit<T> implements LazyLoader<T> {
  T value;
  LazyLoader<T> valueSupplier;

  public LazyLoaderInit(LazyLoader<T> valueSupplier) {
    this.valueSupplier = valueSupplier;
  }

  @Override
  public T get() {
    if (value == null) value = valueSupplier.get();
    return value;
  }
}
