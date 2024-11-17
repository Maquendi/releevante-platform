package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.types.SmartLibraryState;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.ImmutableExt;
import com.releevante.types.Slid;
import com.releevante.types.exceptions.ConfigurationException;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibrary.class)
@JsonSerialize(as = SmartLibrary.class)
@ImmutableExt
public abstract class AbstractSmartLibrary {

  abstract Slid id();

  abstract OrgId orgId();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract List<SmartLibraryStatus> statuses();

  abstract List<Client> clients();

  public SmartLibraryStatus currentStatus() {
    var data = new ArrayList<>(statuses());
    data.sort(Comparator.comparing(SmartLibraryStatus::createdAt));

    if (data.size() == 0) {
      throw new ConfigurationException("library invalid status");
    }

    return data.get(data.size() - 1);
  }

  public void validateIsAuthorized(AccountPrincipal principal) {
    if (!orgId().value().equals(principal.orgId()) && !principal.isSuperAdmin()) {
      throw new UserUnauthorizedException();
    }
  }

  public void validateIsActive() {
    var status = currentStatus();
    if (status.state().equals(SmartLibraryState.never)
        || status.state().equals(SmartLibraryState.disconnected)) {
      throw new ConfigurationException("library not configured");
    }
  }

  public void validateCanAccess(AccountPrincipal principal) {
    validateIsAuthorized(principal);
    validateIsActive();
  }
}
