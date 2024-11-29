package com.releevante.core.domain.tasks;

import com.releevante.core.domain.tags.AuthorizedOrigin;
import com.releevante.types.ImmutableObject;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableObject
public abstract class Task {
  public abstract String id();

  public abstract String name();

  public abstract ZonedDateTime startedAt();

  public abstract Optional<ZonedDateTime> finishedAt();

  public abstract ZonedDateTime updatedAt();

  public abstract Optional<Long> result();

  public abstract AuthorizedOrigin authorizedOrigin();

  @Value.Default
  public List<String> errors() {
    return Collections.emptyList();
  }
}
