package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.identity.domain.service.PasswordEncoder;
import com.releevante.types.ImmutableExt;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = AccessCredential.class)
@JsonSerialize(as = AccessCredential.class)
@ImmutableExt
public abstract class AbstractAccessCredential {
  static final String ACCESS_TYPE_PIN = "pin";
  static final String ACCESS_TYPE_NFC = "nfc";

  abstract String key();

  abstract String value();

  public static AccessCredential from(AccessCode pin, PasswordEncoder encoder) {
    return AccessCredential.builder()
        .key(ACCESS_TYPE_PIN)
        .value(encoder.encode(pin.value()))
        .build();
  }

  public static AccessCredential from(NfcUid nfcUid, PasswordEncoder encoder) {
    return AccessCredential.builder()
        .key(ACCESS_TYPE_NFC)
        .value(encoder.encode(nfcUid.value()))
        .build();
  }
}
