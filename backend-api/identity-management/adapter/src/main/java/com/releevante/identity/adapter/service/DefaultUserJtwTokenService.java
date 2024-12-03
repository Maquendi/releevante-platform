/* (C)2024 */
package com.releevante.identity.adapter.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.releevante.identity.application.dto.LoginTokenDto;
import com.releevante.identity.application.service.auth.JtwTokenService;
import com.releevante.identity.domain.model.AuthorizedOrigin;
import com.releevante.identity.domain.model.LoginAccount;
import com.releevante.identity.domain.model.SmartLibraryAccess;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.Instant;
import java.util.List;
import reactor.core.publisher.Mono;

public class DefaultUserJtwTokenService implements JtwTokenService {
  final JwtRsaSigningKeyProvider signingKeyProvider;
  final String SUBJECT = "sub";
  final String ORG_ID = "org";
  final String ROLES = "roles";
  final String GUEST_ACCESS = "guest";
  final int SEVEN_DAYS_IN_SECOND = 604800;
  final int FIVE_HOURS_IN_SECOND = 18000;
  final int ONE_HOURS_IN_SECOND = 3600;

  public DefaultUserJtwTokenService(JwtRsaSigningKeyProvider signingKeyProvider) {
    this.signingKeyProvider = signingKeyProvider;
  }

  @Override
  public Mono<LoginTokenDto> generateToken(String audience, LoginAccount payload) {
    return signingKeyProvider
        .privateKey()
        .map(
            privateKey -> {
              Algorithm algorithm = Algorithm.RSA256(privateKey);
              return JWT.create()
                  .withAudience(audience)
                  .withClaim(ORG_ID, payload.orgId().value())
                  .withClaim(ROLES, payload.privileges())
                  .withSubject(payload.userName().value())
                  .withExpiresAt(Instant.now().plusSeconds(FIVE_HOURS_IN_SECOND))
                  .sign(algorithm);
            })
        .map(LoginTokenDto::of);
  }

  @Override
  public Mono<LoginTokenDto> generateToken(AuthorizedOrigin authorizedOrigin) {
    return signingKeyProvider
        .privateKey()
        .map(
            privateKey -> {
              Algorithm algorithm = Algorithm.RSA256(privateKey);
              return JWT.create()
                  .withAudience(authorizedOrigin.id())
                  .withClaim(ORG_ID, authorizedOrigin.orgId())
                  .withClaim(ROLES, List.of("AGGREGATOR"))
                  .withSubject(authorizedOrigin.id())
                  .withExpiresAt(Instant.now().plusSeconds(SEVEN_DAYS_IN_SECOND))
                  .sign(algorithm);
            })
        .map(LoginTokenDto::of);
  }

  @Override
  public Mono<LoginTokenDto> generateToken(SmartLibraryAccess payload) {
    return signingKeyProvider
        .privateKey()
        .map(
            privateKey -> {
              Algorithm algorithm = Algorithm.RSA256(privateKey);
              return JWT.create()
                  .withAudience(payload.slid())
                  .withClaim(ORG_ID, payload.orgId().value())
                  .withClaim(ROLES, List.of(GUEST_ACCESS))
                  .withSubject(payload.userId())
                  .withExpiresAt(Instant.now().plusSeconds(ONE_HOURS_IN_SECOND))
                  .sign(algorithm);
            })
        .map(LoginTokenDto::of);
  }

  @Override
  public Mono<AccountPrincipal> verifyToken(LoginTokenDto loginToken) {
    return signingKeyProvider
        .publicKey()
        .map(
            publicKey -> {
              Algorithm algorithm = Algorithm.RSA256(publicKey);
              try {
                JWTVerifier verifier =
                    JWT.require(algorithm)
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
                    .audience(decodedJWT.getAudience().getFirst())
                    .build());
  }
}
