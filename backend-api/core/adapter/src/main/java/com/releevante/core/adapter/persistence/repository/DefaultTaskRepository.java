package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.TaskHibernateDao;
import com.releevante.core.adapter.persistence.records.TaskRecord;
import com.releevante.core.domain.tasks.Task;
import com.releevante.core.domain.tasks.TaskRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class DefaultTaskRepository implements TaskRepository {

  final TaskHibernateDao taskHibernateDao;

  public DefaultTaskRepository(TaskHibernateDao taskHibernateDao) {
    this.taskHibernateDao = taskHibernateDao;
  }

  @Override
  public Mono<Task> findBy(String taskId) {
    return taskHibernateDao.findById(taskId).map(TaskRecord::toDomain);
  }

  @Override
  public Mono<Task> create(Task task) {
    return taskHibernateDao.save(TaskRecord.from(task)).thenReturn(task);
  }

  @Override
  public Mono<Task> update(Task task) {
    return null;
  }
}
