package com.releevante.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.types.SmartLibraryState;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.ConfigurationException;
import com.releevante.types.exceptions.ForbiddenException;
import java.text.MessageFormat;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.IntStream;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibrary.class)
@JsonSerialize(as = SmartLibrary.class)
@ImmutableExt
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public abstract class AbstractSmartLibrary {
  private static final String NAMING_PREFIX = "M{0}-P{1}";

  abstract Slid id();

  @JsonIgnore
  abstract String orgId();

  abstract String modelName();

  abstract int modules();

  abstract int moduleCapacity();

  abstract boolean isActive();

  abstract SmartLibraryState currentStatus();

  @JsonIgnore
  @Value.Default
  List<SmartLibraryStatus> statuses() {
    return Collections.emptyList();
  }

  @Value.Default
  Set<String> allocations() {
    return Collections.emptySet();
  }

  @Value.Default
  Set<String> allPositions() {
    var collection =
        IntStream.range(1, modules() + 1)
            .mapToObj(
                mod ->
                    IntStream.range(1, moduleCapacity() + 1)
                        .mapToObj(pos -> MessageFormat.format(NAMING_PREFIX, mod, pos))
                        .toList())
            .flatMap(Collection::stream)
            .toList();
    return new LinkedHashSet<>(collection);
  }

  public List<String> availablePositions() {
    var availablePositions = new LinkedHashSet<>(this.allPositions());
    var allocations = this.allocations();
    availablePositions.removeAll(allocations);
    return new ArrayList<>(availablePositions);
  }

  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  @Value.Default
  List<Client> clients() {
    return Collections.emptyList();
  }

  @JsonIgnore
  abstract ZonedDateTime createdAt();

  @JsonIgnore
  abstract ZonedDateTime updatedAt();

  public void validateIsAuthorized(AccountPrincipal principal) {
    if (orgId().equals(principal.orgId()) || principal.isSuperAdmin()) {
      return;
    }
    throw new ForbiddenException();
  }

  public void validateIsActive() {
    if (!isActive()
        || currentStatus() == SmartLibraryState.never
        || currentStatus() == SmartLibraryState.disconnected) {
      throw new ConfigurationException("library not configured");
    }
  }

  public void validateCanAccess(AccountPrincipal principal) {
    validateIsAuthorized(principal);
    validateIsActive();
  }
}
