package com.releevante.core.domain.tasks;

import reactor.core.publisher.Mono;

public interface TaskRepository {
  Mono<ImmutableTask> findBy(String taskId);

  Mono<ImmutableTask> create(ImmutableTask task);

  Mono<ImmutableTask> update(ImmutableTask task);
}
