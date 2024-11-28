package com.releevante.core.application.service;

import reactor.core.publisher.Mono;

public interface TaskExecutionService {
  Mono<String> execute(String taskName, Mono<Long> taskRunner);
}
