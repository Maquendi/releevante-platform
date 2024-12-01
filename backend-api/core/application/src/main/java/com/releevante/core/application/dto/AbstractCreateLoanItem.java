package com.releevante.core.application.dto;

import com.releevante.types.ImmutableObject;
import org.immutables.value.Value;

@Value.Immutable
@ImmutableObject
public abstract class AbstractCreateLoanItem {
  abstract String isbn();

  abstract int qty();
}
