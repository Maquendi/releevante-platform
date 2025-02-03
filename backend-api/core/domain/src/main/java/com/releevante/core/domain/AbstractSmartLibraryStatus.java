package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.types.SmartLibraryState;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibraryStatus.class)
@JsonSerialize(as = SmartLibraryStatus.class)
@ImmutableExt
public abstract class AbstractSmartLibraryStatus {

  abstract String id();

  abstract String slid();

  abstract SmartLibraryState state();

  abstract ZonedDateTime createdAt();
}
