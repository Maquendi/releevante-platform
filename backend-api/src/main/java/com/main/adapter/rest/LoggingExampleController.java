package com.main.adapter.rest;

import com.main.config.logging.ReactiveLogger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/logging")
public class LoggingExampleController {

  private final ReactiveLogger logger = new ReactiveLogger(LoggingExampleController.class);
  private final LoggingExampleService loggingExampleService;

  public LoggingExampleController(LoggingExampleService loggingExampleService) {
    this.loggingExampleService = loggingExampleService;
  }

  @GetMapping("/example")
  public Mono<String> example() {
    return Mono.deferContextual(
        ctx -> {
          logger.info("Received request to /api/logging/example");
          return Mono.just("Logging example - check the logs for correlation ID")
              .doOnNext(result -> logger.info("Returning response from /api/logging/example"));
        });
  }

  @GetMapping("/external")
  public Mono<String> callExternalService() {
    return Mono.deferContextual(
        ctx -> {
          logger.info("Received request to /api/logging/external");
          return loggingExampleService
              .callExternalService()
              .doOnNext(result -> logger.info("Returning response from external service"));
        });
  }
}
