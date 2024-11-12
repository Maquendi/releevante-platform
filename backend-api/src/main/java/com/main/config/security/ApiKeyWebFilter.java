package com.main.config.security;

import com.releevante.types.exceptions.UserUnauthorizedException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class ApiKeyWebFilter implements WebFilter {
  final String API_KEY_HEADER_KEY = "x-api-key";

  @Value("${security.api.keys}")
  private List<String> apiKeys = new ArrayList<>();

  final CustomAuthenticationEntryPoint authenticationEntryPoint;

  public ApiKeyWebFilter(CustomAuthenticationEntryPoint authenticationEntryPoint) {
    this.authenticationEntryPoint = authenticationEntryPoint;
  }

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    return verifyApiKey(exchange)
        .filter(Boolean::booleanValue)
        .flatMap(v -> chain.filter(exchange))
        .switchIfEmpty(
            authenticationEntryPoint.commence(
                exchange, new CustomAuthenticationException(new UserUnauthorizedException())));
  }

  private Mono<Boolean> verifyApiKey(ServerWebExchange exchange) {
    return extractApiKeyFromRequest(exchange)
        .map(apiKeys::contains)
        .filter(Boolean::booleanValue)
        .switchIfEmpty(isSwagger(exchange))
        .defaultIfEmpty(true);
  }

  private Mono<Boolean> isSwagger(ServerWebExchange exchange) {
    return Mono.fromCallable(
        () -> {
          return true;
        });
  }

  private Mono<String> extractApiKeyFromRequest(ServerWebExchange exchange) {
    return Mono.justOrEmpty(exchange.getRequest().getHeaders())
        .flatMap(httpHeaders -> Mono.justOrEmpty(httpHeaders.getFirst(API_KEY_HEADER_KEY)));
  }
}
