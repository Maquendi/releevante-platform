package com.releevante.core.application.service.impl;

import com.releevante.core.application.service.TaskExecutionService;
import com.releevante.core.domain.tasks.Task;
import com.releevante.core.domain.tasks.TaskRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

public class DefaultTaskExecutionService implements TaskExecutionService {
  final TaskRepository taskRepository;
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public DefaultTaskExecutionService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  @Override
  public Mono<String> execute(String taskName, Mono<Long> taskRunner) {
    return Mono.fromCallable(
            () ->
                Task.builder()
                    .id(UuidGenerator.instance().next())
                    .name(taskName)
                    .updatedAt(dateTimeGenerator.next())
                    .startedAt(dateTimeGenerator.next())
                    .build())
        .map(
            task -> {
              taskRunner
                  .doOnSuccess(persistWithResults(task))
                  .thenReturn(task)
                  .onErrorResume(persistWithErrors(task))
                  .onErrorStop()
                  .subscribeOn(Schedulers.boundedElastic())
                  .subscribe();
              return task.id();
            });
  }

  private Consumer<Long> persistWithResults(Task task) {
    return res ->
        taskRepository
            .create(task.withResult(res).withFinishedAt(dateTimeGenerator.next()))
            .subscribe();
  }

  Function<Throwable, Mono<Task>> persistWithErrors(Task task) {
    return error ->
        taskRepository.create(
            task.withErrors(List.of(error.getMessage())).withFinishedAt(dateTimeGenerator.next()));
  }
}
