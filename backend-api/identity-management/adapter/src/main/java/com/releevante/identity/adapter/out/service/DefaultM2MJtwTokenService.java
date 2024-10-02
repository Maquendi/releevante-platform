/* (C)2024 */
package com.releevante.identity.adapter.out.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.releevante.application.dto.LoginTokenDto;
import com.releevante.application.service.auth.JtwTokenService;
import com.releevante.identity.domain.model.M2MClient;
import com.releevante.types.AccountPrincipal;
import java.time.Instant;
import java.util.Collections;
import reactor.core.publisher.Mono;

public class DefaultM2MJtwTokenService implements JtwTokenService<M2MClient> {
  final JwtRsaSigningKeyProvider signingKeyProvider;
  final String SUBJECT = "sub";
  final String ORG_ID = "org";
  final String ROLES = "roles";

  public DefaultM2MJtwTokenService(JwtRsaSigningKeyProvider signingKeyProvider) {
    this.signingKeyProvider = signingKeyProvider;
  }

  @Override
  public Mono<LoginTokenDto> generateToken(M2MClient payload) {

    return Mono.zip(signingKeyProvider.publicKey(), signingKeyProvider.privateKey())
        .map(
            rsaKeys -> {
              var publicKey = rsaKeys.getT1();
              var privateKey = rsaKeys.getT2();
              Algorithm algorithm = Algorithm.RSA256(publicKey, privateKey);
              return JWT.create()
                  .withClaim(ORG_ID, payload.orgId())
                  .withSubject(payload.clientId())
                  .withExpiresAt(Instant.now().plusSeconds(60 * 240))
                  .sign(algorithm);
            })
        .map(LoginTokenDto::of);
  }

  @Override
  public Mono<AccountPrincipal> verifyToken(LoginTokenDto loginToken) {
    return Mono.zip(signingKeyProvider.publicKey(), signingKeyProvider.privateKey())
        .map(
            rsaKeys -> {
              var publicKey = rsaKeys.getT1();
              var privateKey = rsaKeys.getT2();
              Algorithm algorithm = Algorithm.RSA256(publicKey, privateKey);
              try {
                JWTVerifier verifier =
                    JWT.require(algorithm)
                        .withClaimPresence(ORG_ID)
                        .withClaimPresence(ROLES)
                        .withClaimPresence(SUBJECT)
                        .build();
                return verifier.verify(loginToken.value());
              } catch (Exception e) {
                throw e;
              }
            })
        .map(
            decodedJWT ->
                AccountPrincipal.builder()
                    .orgId(decodedJWT.getClaim(ORG_ID).asString())
                    .subject(decodedJWT.getSubject())
                    .roles(Collections.emptyList())
                    .build());
  }
}
