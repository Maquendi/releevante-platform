/* (C)2024 */
package com.releevante.config.security;

import com.releevante.identity.application.identity.IdentityServiceFacade;
import com.releevante.types.exceptions.UserUnauthorizedException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationWebFilter implements WebFilter {
  final IdentityServiceFacade identityServiceFacade;
  final CustomAuthenticationEntryPoint authenticationEntryPoint;
  final String AUTHORIZATION_HEADER_KEY = "Authorization";
  final String API_KEY_HEADER_KEY = "x-api-key";

  @Value("${security.api.keys}")
  private List<String> apiKeys = new ArrayList<>();

  public JwtAuthenticationWebFilter(
      IdentityServiceFacade identityServiceFacade,
      CustomAuthenticationEntryPoint authenticationEntryPoint) {
    this.identityServiceFacade = identityServiceFacade;
    this.authenticationEntryPoint = authenticationEntryPoint;
  }

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    return verifyApiKey(exchange)
        .flatMap(
            v ->
                extractJwtFromRequest(exchange)
                    .flatMap(token -> veryToken(token, exchange, chain))
                    .switchIfEmpty(chain.filter(exchange))
                    .onErrorResume(
                        CustomAuthenticationException.class,
                        exception -> authenticationEntryPoint.commence(exchange, exception)));
  }

  private Mono<Boolean> verifyApiKey(ServerWebExchange exchange) {

    return Mono.just(true);
//    return extractApiKeyFromRequest(exchange)
//        .filter(apiKeys::contains)
//        .switchIfEmpty(
//            Mono.error(new CustomAuthenticationException(new UserUnauthorizedException())))
//        .thenReturn(true);
  }

  private Mono<Void> veryToken(String token, ServerWebExchange exchange, WebFilterChain chain) {
    return identityServiceFacade
        .verifyToken(token)
        .flatMap(
            authentication ->
                chain
                    .filter(exchange)
                    .contextWrite(
                        ReactiveSecurityContextHolder.withSecurityContext(
                            Mono.just(new SecurityContextImpl(authentication)))));
  }

  private Mono<String> extractJwtFromRequest(ServerWebExchange exchange) {
    return Mono.justOrEmpty(exchange.getRequest().getHeaders())
        .flatMap(httpHeaders -> Mono.justOrEmpty(httpHeaders.getFirst(AUTHORIZATION_HEADER_KEY)))
        .filter(authHeader -> authHeader.startsWith("Bearer "))
        .map(authHeader -> authHeader.substring(7));
  }

  private Mono<String> extractApiKeyFromRequest(ServerWebExchange exchange) {
    return Mono.justOrEmpty(exchange.getRequest().getHeaders())
        .flatMap(httpHeaders -> Mono.justOrEmpty(httpHeaders.getFirst(API_KEY_HEADER_KEY)));
  }
}
