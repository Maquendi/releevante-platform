/* (C)2024 */
package com.releevante.identity.adapter.out.service;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import reactor.core.publisher.Mono;

public interface JwtRsaSigningKeyProvider {
  Mono<RSAPublicKey> publicKey();

  Mono<RSAPrivateKey> privateKey();
}
