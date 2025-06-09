package com.main.config.logging;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class CorrelationIdWebFilter implements WebFilter {

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    String correlationId =
        exchange.getRequest().getHeaders().getFirst(CorrelationIdUtils.CORRELATION_ID);

    if (correlationId == null || correlationId.isEmpty()) {
      correlationId = CorrelationIdUtils.generateCorrelationId();
      exchange =
          exchange
              .mutate()
              .request(
                  exchange
                      .getRequest()
                      .mutate()
                      .header(CorrelationIdUtils.CORRELATION_ID, correlationId)
                      .build())
              .build();
    }

    // Add the correlation ID to the response headers
    exchange.getResponse().getHeaders().add(CorrelationIdUtils.CORRELATION_ID, correlationId);

    // Add correlation ID to the Reactor Context
    final String finalCorrelationId = correlationId;
    return chain
        .filter(exchange)
        .contextWrite(
            context -> context.put(CorrelationIdUtils.CORRELATION_ID, finalCorrelationId));
  }
}
