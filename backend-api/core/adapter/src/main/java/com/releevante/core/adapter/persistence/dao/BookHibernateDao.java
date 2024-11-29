package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface BookHibernateDao extends ReactiveCrudRepository<BookRecord, String> {

  @Query("select * from core.books b \n" + "order by b.isbn \n" + "limit :size offset :offset")
  Flux<BookRecord> findPaginated(int offset, int size);
}
