/* (C)2024 */
package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.ZonedDateTime;
import java.util.Optional;
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

  /** access code for accessing the smart library identified with slid */
  abstract Optional<AccessCode> accessCode();

  /** nfc hash for accessing the smart library identified with slid */
  abstract Optional<NfcUid> nfcHash();

  abstract ZonedDateTime createdAt();

  abstract ZonedDateTime updatedAt();

  public SmartLibraryAccess checkIsActive() {
    if (!this.isActive()) {
      throw new UserUnauthorizedException();
    }
    return (SmartLibraryAccess) this;
  }
}
