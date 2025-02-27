/* (C)2024 */
package com.releevante.core.domain.identity.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.Auditable;
import com.releevante.types.ImmutableExt;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = SmartLibraryAccess.class)
@JsonSerialize(as = SmartLibraryAccess.class)
@ImmutableExt
public abstract class AbstractSmartLibraryAccess implements Auditable {
  /** identifier of this access */
  abstract String id();

  /** smart library identifier */
  abstract String slid();

  abstract String orgId();

  abstract String accessId();

  abstract Optional<String> contactLessId();

  abstract Boolean isSync();

  abstract Boolean isActive();

  /** credential for accessing the smart library identified with slid */
  abstract Optional<String> credential();

  abstract ZonedDateTime updatedAt();

  abstract ZonedDateTime expiresAt();

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
