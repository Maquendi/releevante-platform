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
public class JwtAuthenticationWebFilter implements WebFilter {
  final IdentityServiceFacade identityServiceFacade;
  final CustomAuthenticationEntryPoint authenticationEntryPoint;

  public JwtAuthenticationWebFilter(
      IdentityServiceFacade identityServiceFacade,
      CustomAuthenticationEntryPoint authenticationEntryPoint) {
    this.identityServiceFacade = identityServiceFacade;
    this.authenticationEntryPoint = authenticationEntryPoint;
  }

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    return extractJwtFromRequest(exchange)
        .flatMap(
            token ->
                identityServiceFacade
                    .verifyToken(token)
                    .flatMap(
                        authentication ->
                            chain
                                .filter(exchange)
                                .contextWrite(
                                    ReactiveSecurityContextHolder.withSecurityContext(
                                        Mono.just(new SecurityContextImpl(authentication))))))
        .switchIfEmpty(chain.filter(exchange))
        .onErrorResume(
            CustomAuthenticationException.class,
            exception -> authenticationEntryPoint.commence(exchange, exception));
  }

  private Mono<String> extractJwtFromRequest(ServerWebExchange exchange) {
    return Mono.justOrEmpty(exchange.getRequest().getHeaders())
        .flatMap(httpHeaders -> Mono.justOrEmpty(httpHeaders.getFirst("Authorization")))
        .filter(authHeader -> authHeader.startsWith("Bearer "))
        .map(authHeader -> authHeader.substring(7));
  }
}
