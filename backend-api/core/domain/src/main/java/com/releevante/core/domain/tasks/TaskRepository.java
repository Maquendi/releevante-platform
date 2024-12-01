package com.releevante.core.domain.tasks;

import reactor.core.publisher.Mono;

public interface TaskRepository {
  Mono<Task> findBy(String taskId);

  Mono<Task> create(Task task);

  Mono<Task> update(Task task);
}
