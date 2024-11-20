package com.main.config.security;

import com.main.application.identity.IdentityServiceFacade;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

@Component
public class JwtServerAuthenticationConverter implements ServerAuthenticationConverter {
  final String API_KEY_HEADER_KEY = "x-api-key";

  @Value("${security.api.keys}")
  private List<String> apiKeys = new ArrayList<>();

  @Value("${springdoc.swagger-ui.custom-url}")
  private String swaggerUi;

  @Value("${springdoc.api-docs.path}")
  private String swaggerDoc;

  final IdentityServiceFacade identityService;
  private static final String BEARER = "Bearer ";

  public JwtServerAuthenticationConverter(IdentityServiceFacade identityService) {
    this.identityService = identityService;
  }

  @Override
  public Mono<Authentication> convert(ServerWebExchange exchange) {
    return Mono.zip(verifyApiKey(exchange), extractJwtToken(exchange)).map(Tuple2::getT2);
  }

  private Mono<Authentication> extractJwtToken(ServerWebExchange exchange) {
    return extractAuthTokenFromRequest(exchange)
        .filter(header -> header.startsWith(BEARER))
        .map(header -> header.substring(BEARER.length()))
        .flatMap(identityService::verifyToken);
  }

  private Mono<Boolean> verifyApiKey(ServerWebExchange exchange) {
    return verifyApiKeyHeader(exchange).filter(Boolean::booleanValue);
  }

  private Mono<Boolean> verifyApiKeyHeader(ServerWebExchange exchange) {
    return extractApiKeyFromRequest(exchange)
        .map(apiKeys::contains)
        .filter(Boolean::booleanValue)
        .switchIfEmpty(
            Mono.defer(
                () ->
                    Mono.just(exchange.getRequest().getPath().value())
                        .map(path -> path.contains(swaggerUi) || path.contains(swaggerDoc))
                        .filter(Boolean::booleanValue)
                        .switchIfEmpty(Mono.error(new UserUnauthorizedException()))));
  }

  private Mono<String> extractAuthTokenFromRequest(ServerWebExchange exchange) {
    return Mono.justOrEmpty(exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION));
  }

  private Mono<String> extractApiKeyFromRequest(ServerWebExchange exchange) {
    return Mono.justOrEmpty(exchange.getRequest().getHeaders())
        .flatMap(httpHeaders -> Mono.justOrEmpty(httpHeaders.getFirst(API_KEY_HEADER_KEY)));
  }
}
