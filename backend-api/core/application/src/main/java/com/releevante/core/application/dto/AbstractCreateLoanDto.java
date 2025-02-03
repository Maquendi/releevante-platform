package com.releevante.core.application.dto;

import com.releevante.types.ImmutableObject;
import java.time.ZonedDateTime;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable
@ImmutableObject
public abstract class AbstractCreateLoanDto {
  abstract ZonedDateTime estimatedReturn();

  abstract List<CreateLoanItem> items();
}
