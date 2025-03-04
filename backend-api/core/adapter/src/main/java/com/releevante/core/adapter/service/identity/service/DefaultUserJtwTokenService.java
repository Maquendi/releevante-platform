/* (C)2024 */
package com.releevante.core.adapter.service.identity.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.releevante.core.application.identity.dto.LoginTokenDto;
import com.releevante.core.application.identity.service.auth.JtwTokenService;
import com.releevante.core.domain.identity.model.AuthorizedOrigin;
import com.releevante.core.domain.identity.model.LoginAccount;
import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import com.releevante.types.AccountPrincipal;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import reactor.core.publisher.Mono;

public class DefaultUserJtwTokenService implements JtwTokenService {
  final JwtRsaSigningKeyProvider signingKeyProvider;
  final String SUBJECT = "sub";
  final String ORG_ID = "org";
  final String ROLES = "roles";

  final String USER_NAME = "username";
  final String CLIENT_ACCESS = "CLIENT";
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
                  .withClaim(USER_NAME, payload.userName().value())
                  .withSubject(payload.accountId().value())
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
                  .withClaim(ROLES, List.of(authorizedOrigin.role()))
                  .withSubject(authorizedOrigin.id())
                  .withExpiresAt(
                      Instant.now().plus(authorizedOrigin.sessionTTlHour(), ChronoUnit.HOURS))
                  .sign(algorithm);
            })
        .map(LoginTokenDto::of);
  }

  @Override
  public Mono<LoginTokenDto> generateToken(String audience, SmartLibraryAccess payload) {
    return signingKeyProvider
        .privateKey()
        .map(
            privateKey -> {
              Algorithm algorithm = Algorithm.RSA256(privateKey);
              return JWT.create()
                  .withAudience(audience)
                  .withClaim(ORG_ID, payload.orgId())
                  .withClaim(ROLES, List.of(CLIENT_ACCESS))
                  .withSubject(payload.id())
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
