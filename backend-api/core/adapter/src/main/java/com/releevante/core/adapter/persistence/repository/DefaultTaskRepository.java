package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.TaskHibernateDao;
import com.releevante.core.adapter.persistence.records.TaskRecord;
import com.releevante.core.domain.tasks.ImmutableTask;
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
  public Mono<ImmutableTask> findBy(String taskId) {
    return taskHibernateDao.findById(taskId).map(TaskRecord::toDomain);
  }

  @Override
  public Mono<ImmutableTask> create(ImmutableTask task) {
    return taskHibernateDao.save(TaskRecord.from(task)).thenReturn(task);
  }

  @Override
  public Mono<ImmutableTask> update(ImmutableTask task) {
    return null;
  }
}
