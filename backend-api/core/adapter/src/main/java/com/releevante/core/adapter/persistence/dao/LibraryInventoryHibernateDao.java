package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.BookCopyProjection;
import com.releevante.core.adapter.persistence.records.LibraryInventoryRecord;
import java.util.Set;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface LibraryInventoryHibernateDao
    extends ReactiveCrudRepository<LibraryInventoryRecord, String> {

  @Modifying
  @Query("update core.library_inventories set status = :status where cpy in (:copies)")
  Mono<Void> updateInventoryStatusByCpy(
      @Param("status") String status, @Param("copies") Set<String> copies);

  @Modifying
  @Query("update core.library_inventories set status=:status, is_synced=false where cpy=:cpy")
  Mono<Void> updateInventoryStatusByCpy(@Param("status") String status, @Param("cpy") String cpy);

  @Modifying
  Flux<LibraryInventoryRecord> findAllBySlidAndIsSyncFalse(String slid);

  @Query(
      "update core.library_inventories li \n"
          + "set usage_count = (usage_count + 1), status='AVAILABLE'\n"
          + "where li.cpy=:cpy")
  Mono<Void> updateLibraryInventoryUsageCount(@Param("cpy") String cpy);

  @Query(
      "with subquery as (\n"
          + " with items_last_status as (\n"
          + "select\n"
          + "\t\ttis.item_id,\n"
          + "\t\tmax(tis.created_at) as created_at\n"
          + "from\n"
          + "\t\tcore.transaction_item_status tis\n"
          + "group by\n"
          + "\t\ttis.item_id, tis.is_synced\n"
          + "having\n"
          + "\ttis.is_synced = false\n"
          + ")\n"
          + "select\n"
          + "\t\tti.cpy as copy_id,\n"
          + "\t\tcase\n"
          + "\t\t\twhen tis.status = 'CHECK_OUT_SUCCESS' \n"
          + "\t\t\tthen case\n"
          + "\t\t\twhen bt.transaction_type = 'RENT' then 'BORROWED'\n"
          + "\t\t\telse 'SOLD'\n"
          + "\t\tend\n"
          + "\t\twhen tis.status = 'LOST' then 'LOST'\n"
          + "\t\twhen tis.status = 'SOLD' then 'SOLD'\n"
          + "\t\twhen tis.status = 'DAMAGED' then 'DAMAGED'\n"
          + "\t\telse 'AVAILABLE'\n"
          + "\tend\n"
          + "\t     as status,\n"
          + "\t\tcase\n"
          + "\t\t\twhen tis.status = 'CHECKIN_SUCCESS' then 1\n"
          + "\t\telse 0\n"
          + "\tend\n"
          + "        as usage_count_new\n"
          + "from\n"
          + "\t\tcore.transaction_item_status tis\n"
          + "join items_last_status ils on\n"
          + "\tils.created_at = tis.created_at\n"
          + "join core.transaction_items ti on\n"
          + "\tti.id = tis.item_id\n"
          + "join core.book_transactions bt on\n"
          + "\tbt.id = ti.transaction_id\n"
          + ")\n"
          + "update\n"
          + "\tcore.library_inventories li\n"
          + "set\n"
          + "\tusage_count = (usage_count + subquery.usage_count_new),\n"
          + "\tstatus = subquery.status,\n"
          + "\tis_sync = false\n"
          + "from\n"
          + "\tsubquery\n"
          + "where\n"
          + "\tcpy = subquery.copy_id;")
  Mono<Void> updateLibraryInventories();

  @Query(
      value =
          "select\n"
              + "\tli.cpy,\n"
              + "\tli.isbn,\n"
              + "\tli.slid,\n"
              + "\tli.is_sync,\n"
              + "\tli.usage_count,\n"
              + "\tli.status,\n"
              + "\tli.allocation,\n"
              + "\tli.created_at,\n"
              + "\tli.updated_at,\n"
              + "\tb.price,\n"
              + "\tb.title,\n"
              + "\tb.author,\n"
              + "\tb.description,\n"
              + "\tb.description_fr,\n"
              + "\tb.description_es,\n"
              + "\tb.lang,\n"
              + "\tb.correlation_id,\n"
              + "\tb.translation_id,\n"
              + "\tb.print_length,\n"
              + "\tb.publish_date,\n"
              + "\tb.publisher,\n"
              + "\tb.dimensions,\n"
              + "\tb.rating,\n"
              + "\tb.votes,\n"
              + "\tb.binding_type,\n"
              + "\tb.public_isbn\n"
              + "from\n"
              + "\tcore.library_inventories li\n"
              + "inner join core.books b on\n"
              + "\tb.isbn = li.isbn\n"
              + "where\n"
              + "\tli.slid=:slid\n"
              + "\tand li.is_sync=:synced\n"
              + "order by li.created_at asc \n"
              + "limit :size offset :offset")
  Flux<BookCopyProjection> findAllCopies(
      @Param("slid") String slid,
      @Param("synced") boolean synced,
      @Param("offset") int offset,
      @Param("size") int size);

  @Query(
      value =
          "select\n"
              + "\tli.cpy,\n"
              + "\tli.isbn,\n"
              + "\tli.slid,\n"
              + "\tli.is_sync,\n"
              + "\tli.usage_count,\n"
              + "\tli.allocation,\n"
              + "\tli.status,\n"
              + "\tli.created_at,\n"
              + "\tli.updated_at,\n"
              + "\tb.price,\n"
              + "\tb.title,\n"
              + "\tb.author,\n"
              + "\tb.description,\n"
              + "\tb.description_fr,\n"
              + "\tb.description_es,\n"
              + "\tb.lang,\n"
              + "\tb.correlation_id,\n"
              + "\tb.translation_id,\n"
              + "\tb.print_length,\n"
              + "\tb.publish_date,\n"
              + "\tb.publisher,\n"
              + "\tb.dimensions,\n"
              + "\tb.rating,\n"
              + "\tb.votes,\n"
              + "\tb.binding_type,\n"
              + "\tb.public_isbn\n"
              + "from\n"
              + "\tcore.library_inventories li\n"
              + "inner join core.books b on\n"
              + "\tb.isbn = li.isbn\n"
              + "where\n"
              + "\tli.slid=:slid\n"
              + "order by li.isbn asc\n"
              + "limit :size offset :offset")
  Flux<BookCopyProjection> findAllCopies(
      @Param("slid") String slid, @Param("offset") int offset, @Param("size") int size);

  @Query("update core.library_inventories set is_sync = true where slid = :slid")
  Mono<Integer> setSynchronized(@Param("slid") String slid);

  @Query(
      "select\n"
          + "\tallocation\n"
          + "from\n"
          + "\tcore.library_inventories li\n"
          + "where\n"
          + "\tli.slid = :slid\n"
          + "\tand li.status in ('AVAILABLE', 'BORROWED')")
  Flux<String> getAllocations(String slid);
}
