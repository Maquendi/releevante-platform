package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.BookTagProjection;
import com.releevante.core.adapter.persistence.records.TagRecord;
import java.util.List;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface TagHibernateDao extends ReactiveCrudRepository<TagRecord, String> {
  Flux<TagRecord> findAllByValueIn(List<String> values);

  Mono<TagRecord> findFirstByValueIgnoreCase(String value);

  Flux<TagRecord> findAllByName(String name);

  @Query(
      "select\n"
          + "\tt.id,\n"
          + "\tt.\"name\",\n"
          + "\tt.value_en,\n"
          + "\tt.value_fr,\n"
          + "\tt.value_sp,\n"
          + "\tbt.id AS book_tag_id,\n"
          + "\tbt.created_at\n"
          + "from\n"
          + "\tcore.tags t\n"
          + "join core.book_tags bt \n"
          + "on\n"
          + "\tbt.tag_id = t.id\n"
          + "where\n"
          + "\tbt.isbn=:isbn")
  Flux<BookTagProjection> findByIsbn(String isbn);
}
