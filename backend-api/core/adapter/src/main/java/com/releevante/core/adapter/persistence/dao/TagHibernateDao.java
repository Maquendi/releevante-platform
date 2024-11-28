package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.TagRecord;
import java.util.List;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface TagHibernateDao extends ReactiveCrudRepository<TagRecord, String> {
  Flux<TagRecord> findAllByValueIn(List<String> values);

  Mono<TagRecord> findFirstByValueIgnoreCase(String value);

  Flux<TagRecord> findAllByName(String name);
}
