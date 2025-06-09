package com.main.adapter.rest;

import com.main.config.logging.ReactiveLogger;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class LoggingExampleService {

  private final ReactiveLogger logger = new ReactiveLogger(LoggingExampleService.class);
  private final WebClient webClient;

  public LoggingExampleService(WebClient webClient) {
    this.webClient = webClient;
  }

  public Mono<String> callExternalService() {
    logger.info("Calling external service");

    return webClient
        .get()
        .uri("https://jsonplaceholder.typicode.com/todos/1")
        .retrieve()
        .bodyToMono(String.class)
        .doOnNext(response -> logger.info("Received response from external service"))
        .doOnError(error -> logger.error("Error calling external service", error));
  }
}
