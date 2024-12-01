package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.tasks.Task;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "tasks", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class TaskRecord extends PersistableEntity {

  @Id private String id;

  private String name;

  private ZonedDateTime startedAt;

  private ZonedDateTime endedAt;

  private List<String> errors;

  private long result;

  public static TaskRecord from(Task task) {
    var record = new TaskRecord();
    record.setId(task.id());
    record.setName(task.name());
    record.setStartedAt(task.startedAt());
    record.setEndedAt(task.finishedAt().orElse(null));
    record.setUpdatedAt(task.updatedAt());
    record.setErrors(task.errors());
    record.setResult(task.result().orElse(0L));
    task.authorizedOrigin().id();
    return record;
  }

  public Task toDomain() {
    return Task.builder()
        .id(id)
        .name(name)
        .startedAt(startedAt)
        .finishedAt(endedAt)
        .errors(errors)
        .updatedAt(updatedAt)
        .result(result)
        .build();
  }
}
