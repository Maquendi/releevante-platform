package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.SmartLibraryEventRecord;
import java.util.Set;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface SmartLibraryEventsHibernateDao
    extends ReactiveCrudRepository<SmartLibraryEventRecord, String> {
  Flux<SmartLibraryEventRecord> findAllBySlidIn(Set<String> slidSet);

  Flux<SmartLibraryEventRecord> findAllBySlid(String slid);
}
