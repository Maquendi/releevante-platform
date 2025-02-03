package com.main.config.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class CustomAccessDeniedHandler implements ServerAccessDeniedHandler {
  @Override
  public Mono<Void> handle(ServerWebExchange exchange, AccessDeniedException denied) {
    return CustomAuthExceptionHandler.commence(exchange, denied, HttpStatus.FORBIDDEN);
  }
}
