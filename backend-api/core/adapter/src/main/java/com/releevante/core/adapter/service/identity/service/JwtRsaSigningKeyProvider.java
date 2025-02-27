/* (C)2024 */
package com.releevante.core.adapter.service.identity.service;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import reactor.core.publisher.Mono;

public interface JwtRsaSigningKeyProvider {
  Mono<RSAPublicKey> publicKey();

  Mono<RSAPrivateKey> privateKey();
}
