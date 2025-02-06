package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.BookCategoryProjection;
import com.releevante.core.adapter.persistence.dao.projections.BookTagProjection;
import com.releevante.core.adapter.persistence.records.TagRecord;
import java.util.List;
import java.util.Set;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface TagHibernateDao extends ReactiveCrudRepository<TagRecord, String> {
  Flux<TagRecord> findAllByValueIn(List<String> values);

  Mono<TagRecord> findFirstByValueIgnoreCase(String value);

  Flux<TagRecord> findAllByNameIn(Set<String> names);

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

  @Query(
      "select\n"
          + "\tbt.tag_id,\n"
          + "\tbt.isbn,\n"
          + "\tt.\"name\",\n"
          + "\tt.value_en,\n"
          + "\tt.value_fr,\n"
          + "\tt.value_sp\n"
          + "from\n"
          + "\tcore.tags t\n"
          + "inner join core.book_tags bt \n"
          + "on\n"
          + "\tbt.tag_id = t.id\n"
          + "where\n"
          + "\tt.\"name\" = 'category'\n"
          + "\tor t.\"name\" = 'subcategory'")
  Flux<BookCategoryProjection> findBookCategories();

  @Query(
      "with books_by_slid as (\n"
          + "select\n"
          + "\tdistinct(isbn)\n"
          + "from\n"
          + "\tcore.library_inventories li\n"
          + "where\n"
          + "\tli.slid in (\n"
          + "\tselect\n"
          + "\t\tid\n"
          + "\tfrom\n"
          + "\t\tcore.authorized_origins ao\n"
          + "\twhere\n"
          + "\t\tao.org_id =:orgId))\n"
          + "select\n"
          + "\tbt.tag_id,\n"
          + "\tbt.isbn,\n"
          + "\tt.\"name\",\n"
          + "\tt.value_en,\n"
          + "\tt.value_fr,\n"
          + "\tt.value_sp\n"
          + "from\n"
          + "\tcore.tags t\n"
          + "inner join core.book_tags bt \n"
          + "on\n"
          + "\tbt.tag_id = t.id\n"
          + "inner join books_by_slid bs\n"
          + "on\n"
          + "\tbs.isbn = bt.isbn\n"
          + "where\n"
          + "\t(t.\"name\" = 'category'\n"
          + "\t\tor t.\"name\" = 'subcategory')")
  Flux<BookCategoryProjection> findBookCategories(@Param("orgId") String orgId);
}
