package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.dao.projections.TransactionItemStatusProjection;
import com.releevante.core.adapter.persistence.records.BookTransactionRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface BookTransactionHibernateDao
    extends ReactiveCrudRepository<BookTransactionRecord, String> {

  @Query(
      "with items_last_status as (\n"
          + "select\n"
          + "\ttis.item_id,\n"
          + "\tmax(tis.created_at) as created_at\n"
          + "from\n"
          + "\tcore.transaction_item_status tis\n"
          + "group by\n"
          + "\ttis.item_id\n"
          + "having\n"
          + "\ttis.is_synced = false\n"
          + ")\n"
          + "select\n"
          + "\tti.cpy,\n"
          + "\ttis.status\n"
          + "from\n"
          + "\tcore.transaction_item_status tis\n"
          + "join items_last_status ils\n"
          + "on\n"
          + "\tils.created_at = tis.created_at\n"
          + "join core.transaction_items ti \n"
          + "on\n"
          + "\tti.id = tis.item_id\n"
          + "order by\n"
          + "\ttis.status")
  Flux<TransactionItemStatusProjection> findUnSynced();

  @Query("UPDATE core.transaction_item_status SET is_synced=true;")
  Mono<Void> setLibraryInventoriesSynced();

  Flux<BookTransactionRecord> findAllByClientId(String clientId);
}
