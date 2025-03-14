package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.TransactionItemStatusRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface TransactionItemStatusRecordHibernateDao
    extends ReactiveCrudRepository<TransactionItemStatusRecord, String> {
  @Query("UPDATE core.transaction_item_status SET is_synced=true;")
  Mono<Void> setLibraryInventoriesSynced();
}
