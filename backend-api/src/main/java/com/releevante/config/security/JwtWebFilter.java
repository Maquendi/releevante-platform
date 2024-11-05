/* (C)2024 */
package com.releevante.config.security;

import com.releevante.application.identity.IdentityServiceFacade;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class JwtWebFilter implements WebFilter {
  final IdentityServiceFacade identityServiceFacade;
  final CustomAuthenticationEntryPoint authenticationEntryPoint;
  final String AUTHORIZATION_HEADER_KEY = "Authorization";

  public JwtWebFilter(
      IdentityServiceFacade identityServiceFacade,
      CustomAuthenticationEntryPoint authenticationEntryPoint) {
    this.identityServiceFacade = identityServiceFacade;
    this.authenticationEntryPoint = authenticationEntryPoint;
  }

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    return extractJwtFromRequest(exchange)
        .flatMap(token -> veryToken(token, exchange, chain))
        .switchIfEmpty(chain.filter(exchange))
        .onErrorResume(
            CustomAuthenticationException.class,
            exception -> authenticationEntryPoint.commence(exchange, exception));
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
}
