/* (C)2024 */
package com.releevante.identity.adapter.out.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.releevante.application.dto.LoginTokenDto;
import com.releevante.application.service.auth.JtwTokenService;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.Instant;
import reactor.core.publisher.Mono;

public class DefaultUserJtwTokenService implements JtwTokenService<LoginAccount> {
  final JwtRsaSigningKeyProvider signingKeyProvider;
  final String SUBJECT = "sub";
  final String ORG_ID = "org";
  final String ROLES = "roles";

  public DefaultUserJtwTokenService(JwtRsaSigningKeyProvider signingKeyProvider) {
    this.signingKeyProvider = signingKeyProvider;
  }

  @Override
  public Mono<LoginTokenDto> generateToken(LoginAccount payload) {

    return Mono.zip(signingKeyProvider.publicKey(), signingKeyProvider.privateKey())
        .map(
            rsaKeys -> {
              var publicKey = rsaKeys.getT1();
              var privateKey = rsaKeys.getT2();
              Algorithm algorithm = Algorithm.RSA256(publicKey, privateKey);
              return JWT.create()
                  .withIssuer("mee")
                  .withClaim(ORG_ID, payload.orgId().value())
                  .withClaim(ROLES, payload.privileges())
                  .withSubject(payload.userName().value())
                  .withExpiresAt(Instant.now().plusSeconds(3600))
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
                        .withIssuer("mee")
                        .withClaimPresence(ORG_ID)
                        .withClaimPresence(ROLES)
                        .withClaimPresence(SUBJECT)
                        .build();
                return verifier.verify(loginToken.value());

              } catch (Exception e) {
                throw new UserUnauthorizedException();
              }
            })
        .map(
            decodedJWT ->
                AccountPrincipal.builder()
                    .orgId(decodedJWT.getClaim(ORG_ID).asString())
                    .subject(decodedJWT.getSubject())
                    .roles(decodedJWT.getClaim(ROLES).asList(String.class))
                    .build());
  }
}
