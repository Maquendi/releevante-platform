package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.BookProjection;
import com.releevante.core.adapter.persistence.dao.projections.PartialBookProjection;
import com.releevante.core.adapter.persistence.records.BookRecord;
import java.util.List;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface BookHibernateDao extends ReactiveCrudRepository<BookRecord, String> {

  @Query("select * from core.books b \n" + "order by b.isbn \n" + "limit :size offset :offset")
  Flux<BookRecord> findPaginated(int offset, int size);

  @Query(
      "select\n"
          + "\tb.isbn,\n"
          + "\tb.translation_id,\n"
          + "\tb.title,\n"
          + "\tb.author,\n"
          + "\tb.votes,\n"
          + "\tb.rating,\n"
          + "\t(\n"
          + "\tselect\n"
          + "\t\tbi.url\n"
          + "\tfrom\n"
          + "\t\tcore.book_image bi\n"
          + "\twhere\n"
          + "\t\tbi.isbn = b.isbn\n"
          + "\tlimit 1) as image\n"
          + "from\n"
          + "\tcore.books b\n"
          + "where\n"
          + "\tb.isbn in (\n"
          + "\tselect\n"
          + "\t\tisbn\n"
          + "\tfrom\n"
          + "\t\tcore.library_inventories li\n"
          + "\twhere\n"
          + "\t\tli.slid in (\n"
          + "\t\tselect\n"
          + "\t\t\tid\n"
          + "\t\tfrom\n"
          + "\t\t\tcore.authorized_origins ao\n"
          + "\t\twhere\n"
          + "\t\t\tao.org_id=:orgId))")
  Flux<PartialBookProjection> findAllByOrgId(@Param("orgId") String orgId);

  @Query(
      "select\n"
          + "\tb.*,\n"
          + "\t(\n"
          + "\tselect\n"
          + "\t\tbi.url\n"
          + "\tfrom\n"
          + "\t\tcore.book_image bi\n"
          + "\twhere\n"
          + "\t\tbi.isbn = b.isbn\n"
          + "\tlimit 1) as image\n"
          + "from\n"
          + "\tcore.books b\n"
          + "where\n"
          + "\tb.translation_id=:translationId")
  Flux<BookProjection> findAllBy(@Param("translationId") String translationId);

  @Query(
      "select\n"
          + "\tb.*,\n"
          + "\t(select bi.url from core.book_image bi where bi.isbn=b.isbn limit 1) as image\n"
          + "from\n"
          + "\tcore.books b\n"
          + "inner join core.book_tags bt \n"
          + "on\n"
          + "\tbt.isbn = b.isbn\n"
          + "\tand bt.tag_id in (:tagIdList)")
  Flux<BookProjection> getByTagIdList(@Param("tagIdList") List<String> tagIdList);

  @Query(
      "select\n"
          + "\tb.*,\n"
          + "\t(select bi.url from core.book_image bi where bi.isbn=b.isbn limit 1) as image\n"
          + "from\n"
          + "\tcore.books b\n"
          + "where\n"
          + "\tb.isbn in (:isbnList)")
  Flux<BookProjection> getByIsbnList(@Param("isbnList") List<String> isbnList);

  @Query(
      "select\n"
          + "\tb.*,\n"
          + "\t(select bi.url from core.book_image bi where bi.isbn=b.isbn limit 1) as image\n"
          + "from\n"
          + "\tcore.books b\n"
          + "inner join core.book_tags bt \n"
          + "on\n"
          + "\tbt.isbn = b.isbn\n"
          + "inner join core.tags t \n"
          + "on t.id = bt.tag_id\n"
          + "and t.value_en in (:tagValues)")
  Flux<BookProjection> getByTagValues(@Param("tagValues") List<String> tagValues);
}
