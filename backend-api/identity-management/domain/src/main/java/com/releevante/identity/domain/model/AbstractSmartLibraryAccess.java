/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibraryAccess.class)
@JsonSerialize(as = SmartLibraryAccess.class)
@ImmutableExt
public abstract class AbstractSmartLibraryAccess {
  /** identifier of this access */
  abstract String id();

  /** identifier of the org */
  abstract OrgId orgId();

  /** smart library identifier */
  abstract String slid();

  abstract Boolean isActive();

  /** credential for accessing the smart library identified with slid */
  abstract AccessCredential credential();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  abstract ZonedDateTime expiresAt();

  abstract Integer accessDueDays();

  public SmartLibraryAccess checkIsActive() {
    if (!this.isActive()) {
      throw new UserUnauthorizedException();
    }

    if (ZonedDateTime.now().isAfter(expiresAt())) {
      throw new UserUnauthorizedException();
    }
    return (SmartLibraryAccess) this;
  }
}
