package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookImageRecord;
import java.util.Set;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface BookImageHibernateDao extends ReactiveCrudRepository<BookImageRecord, String> {
  Flux<BookImageRecord> findAllByIsbnIn(Set<String> isbn);
}
