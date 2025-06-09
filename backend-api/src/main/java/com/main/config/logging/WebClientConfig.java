package com.main.config.logging;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Configuration
public class WebClientConfig {

  @Bean
  public WebClient webClient() {
    return WebClient.builder().filter(correlationIdFilter()).build();
  }

  private ExchangeFilterFunction correlationIdFilter() {
    return (request, next) ->
        Mono.deferContextual(
            ctx -> {
              ClientRequest clientRequest =
                  ClientRequest.from(request)
                      .header(
                          CorrelationIdUtils.CORRELATION_ID,
                          ctx.getOrDefault(
                              CorrelationIdUtils.CORRELATION_ID,
                              CorrelationIdUtils.generateCorrelationId()))
                      .build();
              return next.exchange(clientRequest);
            });
  }
}
