package com.releevante.core.domain.tasks;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = Task.class)
@JsonSerialize(as = Task.class)
@ImmutableExt
public abstract class AbstractTask {
  abstract String id();

  abstract String name();

  abstract ZonedDateTime startedAt();

  abstract Optional<ZonedDateTime> finishedAt();

  abstract ZonedDateTime updatedAt();

  abstract Optional<Long> result();

  @Value.Default
  List<String> errors() {
    return Collections.emptyList();
  }
}
